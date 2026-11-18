import { useNavigate } from '@tanstack/react-router'
import { useCohortView } from '@/entities/cohort'
import { studentName } from '@/pages/activity-sessions/lib/student-name'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import type { RosterEntry } from '@/shared/api/sessions'

/** Opens a finished attempt's submitted code, naming the student on the way. */
export function useOpenSubmission(assessment: Assessment) {
  const { cohort } = useCohortView()
  const navigate = useNavigate()

  return (entry: RosterEntry) => {
    if (!entry.session) return

    navigate({
      to: '/classes/$cohortRef/activities/$assessmentSlug/submissions/$sessionId',
      params: { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug, sessionId: entry.session.id },
      state: (previous) => ({ ...previous, studentName: studentName(entry) }),
    })
  }
}
