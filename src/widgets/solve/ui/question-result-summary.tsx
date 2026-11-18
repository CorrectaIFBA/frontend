import { LoaderCircle } from 'lucide-react'
import { percentFormat, ResultMeter } from '@/entities/evaluation'
import { cn } from '@/shared/lib/cn'
import { type QuestionResult, isEvaluationRunning } from '@/widgets/solve/lib/attempt-result'

type QuestionResultSummaryProps = {
  /** `undefined` while the results load. */
  entry: QuestionResult | undefined
}

/*
  The final evaluation of one question, at the foot of its test cases.
  Students read the percentage; faculty also read how many cases passed.
*/
export function QuestionResultSummary({ entry }: QuestionResultSummaryProps) {
  if (!entry) return null

  const result = entry.kind === 'evaluated' ? entry.result : null
  const isRunning = entry.kind === 'awaiting' || (result !== null && isEvaluationRunning(result))
  const percentage = entry.kind === 'not-submitted' ? 0 : (result?.percentage ?? null)

  const text =
    entry.kind === 'not-submitted'
      ? 'Nenhum código enviado nesta questão.'
      : entry.kind === 'awaiting' || result?.status === 'QUEUED'
        ? 'Na fila para avaliação…'
        : result?.status === 'RUNNING'
          ? 'Avaliando…'
          : result?.status === 'FAILED'
            ? 'Não foi possível avaliar esta questão.'
            : result?.status === 'CANCELLED'
              ? 'Avaliação cancelada.'
              : result?.compilationSucceeded === false
                ? 'O código não compilou.'
                : result?.totalCount != null
                  ? `${result.passedCount} de ${result.totalCount} ${result.totalCount === 1 ? 'caso passou' : 'casos passaram'}`
                  : 'Casos de teste que passaram.'

  return (
    <div aria-live="polite" className="flex shrink-0 flex-col gap-1.5 border-border border-t px-3 py-2.5 text-[12px] leading-relaxed">
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-muted-foreground">Avaliação final</span>
        {percentage !== null ? (
          <span
            className={cn(
              'ml-auto font-semibold text-[15px] tabular-nums tracking-[-0.01em]',
              percentage >= 100 ? 'text-success' : percentage <= 0 ? 'text-destructive' : 'text-foreground'
            )}
          >
            {percentFormat.format(percentage)}%
          </span>
        ) : null}
      </div>
      {percentage !== null ? <ResultMeter percentage={percentage} /> : null}
      <p className={cn('flex items-center gap-2', result?.status === 'FAILED' ? 'text-destructive' : 'text-muted-foreground')}>
        {isRunning ? <LoaderCircle className="size-3.5 shrink-0 animate-spin motion-reduce:animate-none" /> : null}
        {text}
      </p>
      {result?.status === 'FAILED' && result.errorMessage ? <p className="text-muted-foreground">{result.errorMessage}</p> : null}
    </div>
  )
}
