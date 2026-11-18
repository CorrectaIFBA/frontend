import { Link } from '@tanstack/react-router'
import { ChevronRight, FolderCode } from 'lucide-react'
import { showsScore } from '@/entities/assessment'
import { useCohortView } from '@/entities/cohort'
import { MyResultScore } from '@/features/start-session/ui/my-result-score'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { dateTimeFormat } from '@/shared/lib/date-format'

/*
  On the cohort's activity list, once the attempt ended: a band in the
  cohort's colour leading to the submitted code, with the result when the
  activity shows it. It sits above the row's stretched link, so it opens the
  submission and not the activity.
*/
export function SubmissionBand({ assessment }: { assessment: Assessment }) {
  const { cohort } = useCohortView()
  const session = assessment.mySession

  if (!session || session.state === 'IN_PROGRESS') return null

  return (
    <Link
      className="group/band relative z-10 flex items-center gap-3 rounded-lg border border-(--cohort-ink)/25 bg-(--cohort-ink)/[0.07] px-3 py-2.5 transition-colors hover:border-(--cohort-ink)/45 hover:bg-(--cohort-ink)/[0.12] focus-visible:outline-2 focus-visible:outline-(--cohort-ink) focus-visible:outline-offset-2"
      params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug }}
      to="/classes/$cohortRef/activities/$assessmentSlug/submission"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-(--cohort-ink) text-background">
        <FolderCode className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold text-[13px] text-(--cohort-ink)">Ver seu envio</span>
        <span className="truncate text-muted-foreground text-xs">
          {session.finishedAt ? `Encerrada em ${dateTimeFormat.format(new Date(session.finishedAt))}. ` : ''}
          Código enviado e casos de teste.
        </span>
      </span>
      {showsScore(assessment) ? <MyResultScore assessmentId={assessment.id} className="shrink-0" /> : null}
      <ChevronRight className="size-4 shrink-0 text-(--cohort-ink) transition-transform group-hover/band:translate-x-0.5" />
    </Link>
  )
}
