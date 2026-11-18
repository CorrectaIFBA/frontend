import { gradeFormat, summarizeGrades } from '@/entities/grade'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { QuestionGrade } from '@/shared/api/grades'
import { cn } from '@/shared/lib/cn'

export type GradeLedgerProps = {
  questions: AssessmentQuestion[]
  gradesByQuestionId: Map<string, QuestionGrade>
}

/*
  The attempt's grade, the mean of its question grades, over a strip with
  one segment per question: as wide as the question is worth, filled as far
  as its grade goes. Ungraded questions stay hatched.
*/
export function GradeLedger({ questions, gradesByQuestionId }: GradeLedgerProps) {
  const { score: average, outOf, gradedCount } = summarizeGrades(questions, gradesByQuestionId)
  const scores = questions.map((question) => gradesByQuestionId.get(question.id)?.score ?? null)

  return (
    <div className="flex flex-col gap-2.5 border-border border-b px-4 py-3.5">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Nota da atividade</span>
          <p className="flex items-baseline gap-1.5 tabular-nums">
            <span className="font-semibold text-[28px] leading-none tracking-[-0.04em]">{gradeFormat.format(average)}</span>
            <span className="text-muted-foreground text-xs">de {gradeFormat.format(outOf)}</span>
          </p>
        </div>
        <span className="text-right text-muted-foreground text-xs tabular-nums">
          Média de {questions.length} {questions.length === 1 ? 'questão' : 'questões'}
          <br />
          {gradedCount === questions.length ? 'todas com nota' : `${gradedCount} com nota, as demais contam 0`}
        </span>
      </div>
      <div aria-hidden className="flex h-1.5 gap-0.5">
        {questions.map((question, index) => {
          const maximumGrade = Number(question.maximumGrade)
          const score = scores[index]

          return (
            <span
              className={cn(
                'relative block overflow-hidden rounded-full bg-muted',
                score === null && 'bg-[repeating-linear-gradient(135deg,var(--color-muted)_0_3px,var(--color-border)_3px_5px)]'
              )}
              key={question.id}
              style={{ flexGrow: maximumGrade || 1, flexBasis: 0 }}
            >
              {score !== null ? (
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground/80"
                  style={{ width: `${maximumGrade ? (score / maximumGrade) * 100 : 0}%` }}
                />
              ) : null}
            </span>
          )
        })}
      </div>
    </div>
  )
}
