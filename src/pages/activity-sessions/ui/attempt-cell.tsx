export type AttemptCellProps = { attempt: number }

/** The attempt grows each time faculty reopen the activity for the student. */
export function AttemptCell({ attempt }: AttemptCellProps) {
  if (attempt === 0) return <span className="text-muted-foreground/60">—</span>

  return (
    <span
      className="tabular-nums"
      title={attempt === 1 ? 'Primeira tentativa' : `Reaberta ${attempt - 1} ${attempt === 2 ? 'vez' : 'vezes'}`}
    >
      {attempt}ª
    </span>
  )
}
