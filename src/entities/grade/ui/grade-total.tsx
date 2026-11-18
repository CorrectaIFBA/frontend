import type { GradeSummary } from '@/entities/grade/lib/summarize-grades'
import { gradeFormat } from '@/entities/grade/lib/grade-format'
import { cn } from '@/shared/lib/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

export type GradeTotalProps = {
  summary: GradeSummary
  /** Writes “Nota” before the number, where no column header says it. */
  showsLabel?: boolean
  className?: string
}

/*
  The attempt's grade in one line: the mean of its question grades, over
  what a question is worth. While some question still lacks a grade a
  “parcial” tag follows, and hovering says how many are left.
*/
export function GradeTotal({ summary, showsLabel = false, className }: GradeTotalProps) {
  if (!summary.gradedCount) {
    return <span className={cn('text-muted-foreground text-xs', className)}>{showsLabel ? 'Nota pendente' : 'Sem nota'}</span>
  }

  const isPartial = summary.gradedCount < summary.questionCount
  const label = (
    <span
      aria-label={`Nota ${gradeFormat.format(summary.score)} de ${gradeFormat.format(summary.outOf)}${isPartial ? ', parcial' : ''}`}
      className={cn('inline-flex items-baseline gap-1.5 tabular-nums', className)}
    >
      {showsLabel ? <span className="text-muted-foreground text-xs">Nota</span> : null}
      <span className="font-semibold text-[15px] leading-none tracking-[-0.01em]">{gradeFormat.format(summary.score)}</span>
      <span className="text-muted-foreground text-xs">de {gradeFormat.format(summary.outOf)}</span>
      {isPartial ? (
        <span className="self-center rounded-sm border border-border px-1 text-[10px] text-muted-foreground leading-4">parcial</span>
      ) : null}
    </span>
  )

  if (!isPartial) return label

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-default" tabIndex={0}>
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        {summary.gradedCount} de {summary.questionCount} {summary.questionCount === 1 ? 'questão' : 'questões'} com nota; as
        demais contam como 0
      </TooltipContent>
    </Tooltip>
  )
}
