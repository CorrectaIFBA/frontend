import { Award } from 'lucide-react'
import { gradeFormat } from '@/entities/grade'

export type GradeHighlightProps = {
  score: number
  outOf: number
  /** One line under “Sua nota”. */
  detail: string
}

/* The student's grade in the activity, solid in the cohort's colour, so it reads before anything around it. */
export function GradeHighlight({ score, outOf, detail }: GradeHighlightProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-(--cohort-ink) px-3 py-2.5 text-background">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/15">
        <Award className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold text-[13px]">Sua nota</span>
        <span className="truncate text-background/75 text-xs">{detail}</span>
      </span>
      <span className="flex shrink-0 items-baseline gap-1.5 tabular-nums">
        <span className="font-semibold text-[24px] leading-none tracking-[-0.04em]">{gradeFormat.format(score)}</span>
        <span className="text-background/75 text-xs">de {gradeFormat.format(outOf)}</span>
      </span>
    </div>
  )
}
