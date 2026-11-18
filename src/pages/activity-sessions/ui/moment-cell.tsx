import { dateTimeFormat } from '@/shared/lib/date-format'

export type MomentCellProps = { at: string | null | undefined }

export function MomentCell({ at }: MomentCellProps) {
  if (!at) return <span className="text-muted-foreground/60">—</span>

  return (
    <time className="tabular-nums" dateTime={at}>
      {dateTimeFormat.format(new Date(at))}
    </time>
  )
}
