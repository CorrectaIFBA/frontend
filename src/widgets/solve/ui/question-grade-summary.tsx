import { gradeFormat } from '@/entities/grade'
import type { QuestionGrade } from '@/shared/api/grades'

type QuestionGradeSummaryProps = {
  /** `undefined` when the question has no grade yet. */
  grade: QuestionGrade | undefined
  maximumGrade: number
}

/* The grade faculty gave the question and their comment, at the foot of its test cases. */
export function QuestionGradeSummary({ grade, maximumGrade }: QuestionGradeSummaryProps) {
  const hasScore = grade?.score !== null && grade?.score !== undefined

  return (
    <div className="flex shrink-0 flex-col gap-1.5 border-border border-t px-3 py-2.5 text-[12px] leading-relaxed">
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-muted-foreground">Nota da questão</span>
        {hasScore ? (
          <span className="ml-auto tabular-nums">
            <span className="font-semibold text-[15px] tracking-[-0.01em]">{gradeFormat.format(Number(grade.score))}</span>
            <span className="text-muted-foreground"> de {gradeFormat.format(maximumGrade)}</span>
          </span>
        ) : (
          <span className="ml-auto text-muted-foreground">Ainda sem nota</span>
        )}
      </div>
      {hasScore && grade.comment ? <p className="whitespace-pre-wrap text-foreground">{grade.comment}</p> : null}
    </div>
  )
}
