import { Link } from '@tanstack/react-router'
import { FolderCode } from 'lucide-react'
import { useCohortView } from '@/entities/cohort'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { Button } from '@/shared/ui/button'

export type ViewSubmissionButtonProps = {
  assessment: Assessment
  size?: 'xs' | 'sm'
  className?: string
}

/** Opens the code the student handed in. Only for a finished attempt. */
export function ViewSubmissionButton({ assessment, size = 'sm', className }: ViewSubmissionButtonProps) {
  const { cohort } = useCohortView()
  const session = assessment.mySession

  if (!session || session.state === 'IN_PROGRESS') return null

  return (
    <Button asChild className={className} size={size}>
      <Link
        params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug }}
        to="/classes/$cohortRef/activities/$assessmentSlug/submission"
      >
        <FolderCode /> Ver seu envio
      </Link>
    </Button>
  )
}
