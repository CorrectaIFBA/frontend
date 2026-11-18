import { LoaderCircle } from 'lucide-react'
import { percentFormat, ResultMeter } from '@/entities/evaluation'
import type { AttemptResult } from '@/widgets/solve/lib/attempt-result'

type AttemptResultBadgeProps = {
  /** `null` while the results load or when they could not be read. */
  attempt: AttemptResult | null
}

/*
  The attempt's result in the review header: the share of test cases passed,
  averaged over the questions. Faculty also read the cases behind it.
*/
export function AttemptResultBadge({ attempt }: AttemptResultBadgeProps) {
  if (!attempt) return null

  if (attempt.state !== 'ready' || attempt.percentage === null) {
    return (
      <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
        {attempt.state === 'pending' ? <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" /> : null}
        {attempt.state === 'pending' ? 'Avaliando' : 'Resultado indisponível'}
      </span>
    )
  }

  return (
    <span
      aria-label={`Resultado: ${percentFormat.format(attempt.percentage)}% dos casos de teste`}
      className="flex items-center gap-2 rounded-md border border-border px-2 py-1"
    >
      <span className="text-muted-foreground text-xs">Resultado</span>
      <ResultMeter className="w-10" percentage={attempt.percentage} />
      <span className="font-semibold text-[13px] tabular-nums">{percentFormat.format(attempt.percentage)}%</span>
      {attempt.totalCount !== null ? (
        <span className="hidden text-muted-foreground text-xs tabular-nums xl:inline">
          {attempt.passedCount} de {attempt.totalCount} casos
        </span>
      ) : null}
    </span>
  )
}
