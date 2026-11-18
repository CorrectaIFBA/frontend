import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useCohortView } from '@/entities/cohort'
import { SESSION_STATE_LABEL } from '@/entities/session'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { sessionCountsQueryOptions, type SessionState } from '@/shared/api/sessions'
import { cn } from '@/shared/lib/cn'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { Skeleton } from '@/shared/ui/skeleton'

const ORDER: SessionState[] = ['IN_PROGRESS', 'SUBMITTED', 'EXPIRED']

/** Faculty's glance at the submissions: how many in each state, and the way to the full list. */
export function SessionsPanel({ assessment }: { assessment: Assessment }) {
  const { cohort } = useCohortView()
  const query = useQuery({ ...sessionCountsQueryOptions(assessment.id), refetchInterval: 30_000 })

  return (
    <Panel>
      <PanelHeading
        action={
          <Link
            className="text-muted-foreground text-xs underline decoration-border-strong underline-offset-4 hover:text-foreground"
            params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug }}
            to="/classes/$cohortRef/activities/$assessmentSlug/sessions"
          >
            Ver envios
          </Link>
        }
        title="Envios"
      />
      {query.isError ? (
        <p className="p-4 text-muted-foreground text-xs">{errorMessage(query.error)}</p>
      ) : query.isPending ? (
        <div className="grid grid-cols-2 gap-px bg-border">
          {ORDER.map((state) => (
            <Skeleton className="h-16 rounded-none" key={state} />
          ))}
        </div>
      ) : (
        <dl className="grid grid-cols-2 gap-px bg-border">
          {ORDER.map((state) => (
            <div className="flex flex-col gap-1 bg-card px-4 py-3" key={state}>
              <dt className="text-muted-foreground text-xs">{SESSION_STATE_LABEL[state]}</dt>
              <dd
                className={cn(
                  'font-semibold text-[20px] tabular-nums leading-none tracking-[-0.03em]',
                  !query.data[state] && 'text-muted-foreground/60',
                  state === 'IN_PROGRESS' && query.data[state] && 'text-(--cohort-ink)'
                )}
              >
                {query.data[state] ?? 0}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Panel>
  )
}
