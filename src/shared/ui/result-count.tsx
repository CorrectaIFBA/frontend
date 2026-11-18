/** How many rows the current filters match, at the toolbar's far end. */
export function ResultCount({ total, one, many }: { total?: number; one: string; many: string }) {
  if (total === undefined) return null
  return (
    <span className="ml-auto text-muted-foreground text-xs tabular-nums">
      <span className="font-medium text-foreground">{total.toLocaleString('pt-BR')}</span>{' '}
      {total === 1 ? one : many}
    </span>
  )
}
