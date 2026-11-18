import type { ReactNode } from 'react'
import { gradeFormat } from '@/entities/grade'
import { AccountAvatar } from '@/entities/profile'
import { dateTimeFormat } from '@/shared/lib/date-format'

export type GradeCardProps = {
  /** `null` when the grade was cleared. */
  score: number | null
  maximumGrade: number | undefined
  comment: string | null
  graderName: string
  gradedAt: string | null
  /** Top right, beside the score. */
  action?: ReactNode
}

/** A grade as the faculty member left it: the score, their comment, and who signed it when. */
export function GradeCard({ score, maximumGrade, comment, graderName, gradedAt, action }: GradeCardProps) {
  return (
    <article className="flex flex-col gap-2.5 rounded-md border border-border bg-card px-3.5 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-baseline gap-1.5 tabular-nums">
          {score === null ? (
            <span className="text-muted-foreground text-sm">Nota removida</span>
          ) : (
            <>
              <span className="font-semibold text-[22px] leading-none tracking-[-0.03em]">{gradeFormat.format(score)}</span>
              {maximumGrade !== undefined ? (
                <span className="text-muted-foreground text-xs">de {gradeFormat.format(maximumGrade)}</span>
              ) : null}
            </>
          )}
        </p>
        {action}
      </div>
      {comment ? <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{comment}</p> : null}
      <footer className="flex items-center gap-2 text-muted-foreground text-xs">
        <AccountAvatar className="size-5" fallbackClassName="text-[9px]" name={graderName} type="FACULTY" variant="soft" />
        <span className="min-w-0 truncate text-foreground">{graderName}</span>
        {gradedAt ? (
          <time className="ml-auto shrink-0 tabular-nums" dateTime={gradedAt}>
            {dateTimeFormat.format(new Date(gradedAt))}
          </time>
        ) : null}
      </footer>
    </article>
  )
}
