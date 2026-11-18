import { Link } from '@tanstack/react-router'
import { ChevronRight, FolderCode } from 'lucide-react'
import { useCohortView } from '@/entities/cohort'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'

/** The attempt panel's last row, clickable end to end: the way to the submitted code. */
export function SubmissionLinkRow({ assessment }: { assessment: Assessment }) {
  const { cohort } = useCohortView()

  return (
    <Link
      className="group flex items-center gap-3 border-border border-t px-4 py-3 transition-colors hover:bg-accent/50 focus-visible:bg-accent/60 focus-visible:outline-none"
      params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug }}
      to="/classes/$cohortRef/activities/$assessmentSlug/submission"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-(--cohort-ink)/10 text-(--cohort-ink)">
        <FolderCode className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-medium text-[13px]">Ver seu envio</span>
        <span className="text-muted-foreground text-xs">O código enviado em cada questão e os casos de teste.</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  )
}
