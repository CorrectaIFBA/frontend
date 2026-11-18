import { formatDuration } from '@/entities/session'

export type PageTimeCellProps = { openSeconds: number | null; elapsedSeconds: number | null }

/**
 * Time with the coding page open, drawn against the time that passed since
 * the start: a short bar says at a glance who worked here and who worked
 * elsewhere, or only opened the page to submit.
 */
export function PageTimeCell({ openSeconds, elapsedSeconds }: PageTimeCellProps) {
  if (openSeconds === null || elapsedSeconds === null) return <span className="text-muted-foreground/60">—</span>

  const share = elapsedSeconds > 0 ? Math.min(openSeconds / elapsedSeconds, 1) : 0
  const percent = Math.round(share * 100)

  return (
    <span
      className="flex w-28 flex-col gap-1.5"
      title={`${percent}% do tempo decorrido com a página da atividade aberta`}
    >
      <span className="flex items-baseline justify-between gap-2 tabular-nums">
        {formatDuration(openSeconds)}
        <span className="text-[11px] text-muted-foreground">{percent}%</span>
      </span>
      <span aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
        <span className="block h-full rounded-full bg-(--cohort-ink)/70" style={{ width: `${percent}%` }} />
      </span>
    </span>
  )
}
