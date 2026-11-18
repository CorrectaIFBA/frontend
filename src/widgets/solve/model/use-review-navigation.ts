import { useNavigate } from '@tanstack/react-router'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { QuestionNavigation } from '@/widgets/solve/model/question-navigation'

/** Moving between the questions of a submission: the question is a search parameter of the same page. */
export function useReviewNavigation(questions: AssessmentQuestion[], currentIndex: number): QuestionNavigation {
  const navigate = useNavigate()

  return {
    questions,
    currentIndex,
    goTo: (question) => void navigate({ to: '.', search: { question: question.slug }, replace: true }),
  }
}
