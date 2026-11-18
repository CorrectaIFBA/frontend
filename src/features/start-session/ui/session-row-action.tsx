import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useCohortView } from '@/entities/cohort'
import { startBlocker } from '@/features/start-session/lib/start-blocker'
import { StartDialog } from '@/features/start-session/ui/start-dialog'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { Button } from '@/shared/ui/button'

/** Start before the attempt, resume during it; nothing once it ended (see `SubmissionBand`) or cannot start. */
export function SessionRowAction({ assessment }: { assessment: Assessment }) {
  const { cohort } = useCohortView()
  const session = assessment.mySession

  if (!session) return startBlocker(assessment, cohort.status) ? null : <StartDialog assessment={assessment} compact />
  if (session.state !== 'IN_PROGRESS') return null

  return (
    <Button asChild className="relative z-10" size="xs">
      <Link
        params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug }}
        to="/classes/$cohortRef/activities/$assessmentSlug/solve"
      >
        <Play /> Retomar
      </Link>
    </Button>
  )
}
