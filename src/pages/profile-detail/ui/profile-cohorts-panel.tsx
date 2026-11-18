import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { CohortStatus, CohortTile } from '@/entities/cohort'
import { cohortAddress, cohortsQueryOptions } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { Skeleton } from '@/shared/ui/skeleton'

/** The cohorts a profile currently belongs to, on a staff member's profile page. */
export function ProfileCohortsPanel({ profileId }: { profileId: string }) {
  const query = useQuery(
    cohortsQueryOptions(
      { memberProfileId: profileId },
      { page: 0, size: 50, sortBy: 'createdAt', sortDirection: 'desc' }
    )
  )

  let body: React.ReactNode
  if (query.isPending) {
    body = (
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  } else if (query.isError) {
    body = <p className="px-4 py-5 text-muted-foreground text-xs">{errorMessage(query.error)}</p>
  } else if (query.data.content.length === 0) {
    body = <p className="px-4 py-5 text-muted-foreground text-xs">Não participa de nenhuma turma.</p>
  } else {
    body = (
      <ul className="flex flex-col py-1.5">
        {query.data.content.map((cohort) => (
          <li key={cohort.id}>
            <Link
              className="group flex items-center gap-3 px-4 py-2 transition-colors hover:bg-accent/50"
              params={{ cohortRef: cohortAddress(cohort) }}
              to="/classes/$cohortRef"
            >
              <CohortTile className="size-8 rounded-md text-[11px]" cohort={cohort} />
              <span className="min-w-0 flex-1 truncate font-medium text-[13px]">{cohort.name}</span>
              <CohortStatus state={cohort.status} />
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Panel>
      <PanelHeading
        action={
          query.data && query.data.totalElements > 0 ? (
            <span className="text-muted-foreground text-xs tabular-nums">{query.data.totalElements}</span>
          ) : null
        }
        title="Turmas"
      />
      {body}
    </Panel>
  )
}
