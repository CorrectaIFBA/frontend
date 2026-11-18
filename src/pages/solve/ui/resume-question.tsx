import { Navigate } from '@tanstack/react-router'
import { cohortAddress } from '@/shared/api/cohorts'
import { lastQuestionSlug } from '@/shared/lib/solve-preferences'
import { useSolve } from '@/widgets/solve'

/** Resuming lands on the question the student last had open, or on the first one. */
export function ResumeQuestion() {
  const { cohort, assessment, questions, coding } = useSolve()
  const remembered = lastQuestionSlug(coding.session.id)
  const question = questions.find((candidate) => candidate.slug === remembered) ?? questions[0]

  if (!question) return null

  return (
    <Navigate
      params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug, questionSlug: question.slug }}
      replace
      to="/classes/$cohortRef/activities/$assessmentSlug/solve/$questionSlug"
    />
  )
}
