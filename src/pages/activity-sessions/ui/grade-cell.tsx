import { useQuery } from '@tanstack/react-query'
import { GradeTotal, summarizeGrades } from '@/entities/grade'
import { questionsQueryOptions } from '@/shared/api/assessments'
import { assessmentGradesQueryOptions } from '@/shared/api/grades'

export type GradeCellProps = {
  assessmentId: string
  studentProfileId: string
}

/*
  The grade faculty gave the attempt so far, the sum of its question grades.
  Every row reads the same two queries, so the board asks once.
*/
export function GradeCell({ assessmentId, studentProfileId }: GradeCellProps) {
  const grades = useQuery(assessmentGradesQueryOptions(assessmentId))
  const questions = useQuery(questionsQueryOptions(assessmentId))

  if (grades.isError || questions.isError) return <span className="text-muted-foreground/60">—</span>
  if (!grades.data || !questions.data) return null

  const gradesByQuestionId = new Map(
    grades.data.filter((grade) => grade.studentProfileId === studentProfileId).map((grade) => [grade.questionId, grade])
  )

  return <GradeTotal summary={summarizeGrades(questions.data, gradesByQuestionId)} />
}
