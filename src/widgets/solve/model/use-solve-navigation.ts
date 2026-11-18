import { useNavigate } from '@tanstack/react-router'
import { cohortAddress } from '@/shared/api/cohorts'
import type { QuestionNavigation } from '@/widgets/solve/model/question-navigation'
import { useSolve } from '@/widgets/solve/model/solve-context'

/** Moving between the questions of the coding page: each one has its own address. */
export function useSolveNavigation(currentQuestionId: string | undefined): QuestionNavigation {
  const { cohort, assessment, questions } = useSolve()
  const navigate = useNavigate()

  return {
    questions,
    currentIndex: questions.findIndex((question) => question.id === currentQuestionId),
    goTo: (question) =>
      void navigate({
        to: '/classes/$cohortRef/activities/$assessmentSlug/solve/$questionSlug',
        params: { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug, questionSlug: question.slug },
      }),
  }
}
