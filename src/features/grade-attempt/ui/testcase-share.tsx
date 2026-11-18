import { LoaderCircle } from 'lucide-react'
import { percentFormat, ResultMeter } from '@/entities/evaluation'
import type { QuestionScore } from '@/shared/api/submission-results'

export type TestcaseShareProps = {
  /** `undefined` when the student has no evaluation of the question, or while the summary loads. */
  score: QuestionScore | undefined
  isLoading: boolean
}

/** The share of test cases the question's final evaluation passed, to weigh the grade against. */
export function TestcaseShare({ score, isLoading }: TestcaseShareProps) {
  if (isLoading) return <span className="text-muted-foreground text-xs">Lendo casos de teste…</span>
  if (!score || score.status === null) return <span className="text-muted-foreground text-xs">Sem envio</span>

  if (score.percentage === null) {
    const isRunning = score.status === 'QUEUED' || score.status === 'RUNNING'

    return (
      <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
        {isRunning ? <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" /> : null}
        {isRunning ? 'Avaliando' : 'Resultado indisponível'}
      </span>
    )
  }

  return (
    <span className="flex items-center gap-2 text-xs">
      <ResultMeter className="w-16" percentage={score.percentage} />
      <span className="tabular-nums">
        <span className="font-semibold">{percentFormat.format(score.percentage)}%</span>
        <span className="text-muted-foreground"> dos casos de teste</span>
      </span>
    </span>
  )
}
