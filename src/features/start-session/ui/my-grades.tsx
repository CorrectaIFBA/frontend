import { useQuery } from '@tanstack/react-query'
import { gradeFormat, summarizeGrades } from '@/entities/grade'
import { GradeHighlight } from '@/features/start-session/ui/grade-highlight'
import { questionsQueryOptions } from '@/shared/api/assessments'
import { studentGradesQueryOptions } from '@/shared/api/grades'

export type MyGradesProps = {
  assessmentId: string
  studentProfileId: string
}

/*
  The student's grade in the activity, the mean of the question grades, then
  each question with its grade and the faculty comment. The caller checks
  the activity shows the grades.
*/
export function MyGrades({ assessmentId, studentProfileId }: MyGradesProps) {
  const grades = useQuery(studentGradesQueryOptions(assessmentId, studentProfileId))
  const questions = useQuery(questionsQueryOptions(assessmentId))

  if (!questions.data || !grades.data) return null

  const gradesByQuestionId = new Map(grades.data.map((grade) => [grade.questionId, grade]))
  const summary = summarizeGrades(questions.data, gradesByQuestionId)
  const isPartial = summary.gradedCount < summary.questionCount

  return (
    <div className="border-border border-t">
      <div className="px-4 pt-3 pb-2">
        {summary.gradedCount ? (
          <GradeHighlight
            detail={
              isPartial
                ? `Parcial: ${summary.gradedCount} de ${summary.questionCount} questões com nota.`
                : 'Média das notas das questões.'
            }
            outOf={summary.outOf}
            score={summary.score}
          />
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-[13px]">Nota da atividade</span>
            <span className="text-muted-foreground text-xs">Nota pendente</span>
          </div>
        )}
      </div>
      <ol className="flex flex-col pb-1">
        {questions.data.map((question, index) => {
          const grade = gradesByQuestionId.get(question.id)
          const hasScore = grade?.score !== null && grade?.score !== undefined

          return (
            <li className="flex flex-col gap-1 px-4 py-2" key={question.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-muted-foreground text-xs">
                  {index + 1}. {question.title}
                </span>
                {hasScore ? (
                  <span className="shrink-0 text-xs tabular-nums">
                    <span className="font-semibold">{gradeFormat.format(Number(grade.score))}</span>
                    <span className="text-muted-foreground"> de {gradeFormat.format(Number(question.maximumGrade))}</span>
                  </span>
                ) : (
                  <span className="shrink-0 text-muted-foreground text-xs">Sem nota</span>
                )}
              </div>
              {hasScore && grade.comment ? (
                <p className="whitespace-pre-wrap rounded-md bg-muted/50 px-2.5 py-1.5 text-xs leading-relaxed">{grade.comment}</p>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
