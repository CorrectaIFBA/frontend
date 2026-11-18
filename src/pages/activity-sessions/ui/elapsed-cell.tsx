import { formatDuration } from '@/entities/session'

export type ElapsedCellProps = { seconds: number | null }

export function ElapsedCell({ seconds }: ElapsedCellProps) {
  if (seconds === null) return <span className="text-muted-foreground/60">—</span>

  return <span className="tabular-nums">{formatDuration(seconds)}</span>
}
