import { Link } from '@tanstack/react-router'
import { Hourglass } from 'lucide-react'
import { useRemaining, Remaining } from '@/entities/session'
import { type Cohort, cohortAddress } from '@/shared/api/cohorts'
import type { Session } from '@/shared/api/sessions'

export function BannerRow({ session, cohort }: { session: Session; cohort: Cohort }) {
  const remaining = useRemaining(session)
  if (remaining === null || remaining === 0) return null

  return (
    <div className="flex items-center gap-3 border-border border-b bg-muted/50 px-3 py-2 text-[13px] sm:px-5">
      <Hourglass className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <p className="min-w-0 flex-1 truncate">
        <span className="font-medium">{session.assessmentTitle}</span>
        <span className="text-muted-foreground"> em andamento, restam </span>
        <Remaining ms={remaining} />
      </p>
      <Link
        className="shrink-0 font-medium text-[13px] underline decoration-border-strong underline-offset-4 hover:decoration-current"
        params={{ cohortRef: cohortAddress(cohort), assessmentSlug: session.assessmentSlug }}
        to="/classes/$cohortRef/activities/$assessmentSlug/solve"
      >
        Retomar
      </Link>
    </div>
  )
}
