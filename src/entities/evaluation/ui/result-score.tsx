import { LoaderCircle } from 'lucide-react'
import { percentFormat } from '@/entities/evaluation/lib/percent-format'
import { ResultMeter } from '@/entities/evaluation/ui/result-meter'
import type { QuestionScore, ResultSummary } from '@/shared/api/submission-results'
import { cn } from '@/shared/lib/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

type ResultScoreProps = {
  /** `undefined` while the summary loads. */
  summary: ResultSummary | undefined
  className?: string
}

/*
  The share of test cases an attempt passed, averaged over the questions.
  When the summary carries each question (faculty), hovering lists them.
*/
export function ResultScore({ summary, className }: ResultScoreProps) {
  if (!summary) return null

  if (summary.status === 'HIDDEN') {
    return <span className={cn('text-muted-foreground text-xs', className)}>Pontuação não liberada</span>
  }

  if (summary.status !== 'READY' || summary.percentage === null) {
    return (
      <span className={cn('flex items-center gap-1.5 text-muted-foreground text-xs', className)}>
        {summary.status === 'PENDING' ? <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" /> : null}
        {summary.status === 'PENDING' ? 'Avaliando' : 'Resultado indisponível'}
      </span>
    )
  }

  const score = (
    <span
      aria-label={`Resultado: ${percentFormat.format(summary.percentage)}% dos casos de teste`}
      className={cn('flex items-center gap-2', className)}
    >
      <ResultMeter className="w-10" percentage={summary.percentage} />
      <span className="font-semibold text-[13px] tabular-nums">{percentFormat.format(summary.percentage)}%</span>
    </span>
  )

  if (!summary.questions?.length) return score

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-default" tabIndex={0}>
          {score}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        <ol className="flex flex-col gap-0.5 py-0.5">
          {summary.questions.map((question, index) => (
            <li className="flex items-baseline justify-between gap-4" key={question.questionId}>
              <span className="max-w-56 truncate">
                {index + 1}. {question.title}
              </span>
              <span className="font-medium tabular-nums">{questionScoreLabel(question)}</span>
            </li>
          ))}
        </ol>
      </TooltipContent>
    </Tooltip>
  )
}

function questionScoreLabel(question: QuestionScore) {
  if (question.status === null) return 'Sem envio'
  if (question.percentage === null) return question.status === 'QUEUED' || question.status === 'RUNNING' ? 'Avaliando' : '—'

  return `${percentFormat.format(question.percentage)}%`
}
