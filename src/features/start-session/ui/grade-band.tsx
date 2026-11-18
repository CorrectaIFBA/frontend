import { GradeHighlight } from '@/features/start-session/ui/grade-highlight'
import type { Assessment } from '@/shared/api/assessments'

/*
  On the cohort's activity list, once graded: the student's grade in the
  activity, so it reads before the submission band under it. The grade is the
  mean of the question grades, out of what a question is worth on average. It
  is no link: the row opens the activity, where each question's grade and
  comment are.
*/
export function GradeBand({ assessment }: { assessment: Pick<Assessment, 'score' | 'totalGrade' | 'questionCount'> }) {
  if (assessment.score === null || assessment.score === undefined) return null

  const total = Number(assessment.totalGrade)
  const outOf = assessment.questionCount ? total / assessment.questionCount : total

  return <GradeHighlight detail="Média das notas das questões." outOf={outOf} score={Number(assessment.score)} />
}
