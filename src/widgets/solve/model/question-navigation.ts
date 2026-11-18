import type { AssessmentQuestion } from '@/shared/api/assessments'

/** The questions of a page and how to move between them; built by `useSolveNavigation` and `useReviewNavigation`. */
export type QuestionNavigation = {
  questions: AssessmentQuestion[]
  /** -1 when the address names no question. */
  currentIndex: number
  goTo: (question: AssessmentQuestion) => void
}

export const previousQuestion = ({ questions, currentIndex }: QuestionNavigation) =>
  currentIndex > 0 ? questions[currentIndex - 1] : undefined

export const nextQuestion = ({ questions, currentIndex }: QuestionNavigation) =>
  currentIndex >= 0 && currentIndex < questions.length - 1 ? questions[currentIndex + 1] : undefined
