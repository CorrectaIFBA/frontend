import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useRemaining, LateStatus, Remaining, SessionStatus } from '@/entities/session'
import { type Cohort, cohortAddress } from '@/shared/api/cohorts'
import type { Session } from '@/shared/api/sessions'
import { dateTimeFormat } from '@/shared/lib/date-format'
import { Button } from '@/shared/ui/button'

export function AttemptRow({ session, cohort }: { session: Session; cohort: Cohort | undefined }) {
  const remaining = useRemaining(session)
  const running = session.state === 'IN_PROGRESS'

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {cohort ? (
            <Link
              className="font-medium text-[14px] hover:underline hover:underline-offset-4"
              params={{ cohortRef: cohortAddress(cohort), assessmentSlug: session.assessmentSlug }}
              to={
                running
                  ? '/classes/$cohortRef/activities/$assessmentSlug/solve'
                  : '/classes/$cohortRef/activities/$assessmentSlug'
              }
            >
              {session.assessmentTitle}
            </Link>
          ) : (
            <span className="font-medium text-[14px]">{session.assessmentTitle}</span>
          )}
          <SessionStatus state={session.state} />
          {session.late ? <LateStatus /> : null}
        </div>
        <p className="text-muted-foreground text-xs">
          {cohort ? `${cohort.name} · ` : ''}
          {running ? 'Iniciada' : 'Encerrada'} em{' '}
          {dateTimeFormat.format(new Date(running ? session.startedAt : (session.finishedAt ?? session.startedAt)))}
          {remaining !== null ? (
            <>
              {' · restam '}
              <Remaining ms={remaining} />
            </>
          ) : null}
        </p>
      </div>
      {running && cohort ? (
        <Button asChild size="sm">
          <Link
            params={{ cohortRef: cohortAddress(cohort), assessmentSlug: session.assessmentSlug }}
            to="/classes/$cohortRef/activities/$assessmentSlug/solve"
          >
            <Play /> Retomar
          </Link>
        </Button>
      ) : null}
    </li>
  )
}
