import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { QuestionGrade } from '@/shared/api/grades'

export type GradeSummary = {
  /** Mean of the question grades; an ungraded question counts as 0. */
  score: number
  /** Mean of the questions' maximum grades: what [score] is out of. */
  outOf: number
  gradedCount: number
  questionCount: number
}

/** The attempt's grade: the mean of its question grades, as the service computes the activity's score. */
export function summarizeGrades(questions: AssessmentQuestion[], gradesByQuestionId: Map<string, QuestionGrade>): GradeSummary {
  const questionCount = questions.length
  const scores = questions.map((question) => gradesByQuestionId.get(question.id)?.score ?? null)
  const sum = scores.reduce<number>((accumulated, score) => accumulated + Number(score ?? 0), 0)
  const total = questions.reduce((accumulated, question) => accumulated + Number(question.maximumGrade), 0)

  return {
    score: questionCount ? sum / questionCount : 0,
    outOf: questionCount ? total / questionCount : 0,
    gradedCount: scores.filter((score) => score !== null).length,
    questionCount,
  }
}
