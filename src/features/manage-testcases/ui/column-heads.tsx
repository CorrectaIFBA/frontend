import { ROW_GRID } from '@/features/manage-testcases/config/row-grid'
import { cn } from '@/shared/lib/cn'

/** Names the columns once, above the rows, instead of on every case. */
export function ColumnHeads() {
  return (
    <div
      aria-hidden
      className={cn('hidden gap-x-3 border-border border-b px-4 py-1.5 text-[11px] text-muted-foreground md:grid', ROW_GRID)}
    >
      <span>Caso</span>
      <span className="grid grid-cols-2">
        <span className="px-2.5">Entrada</span>
        <span className="border-border-strong border-l-2 pr-2.5 pl-5.5">Saída esperada</span>
      </span>
      <span className="text-right">Visibilidade e limites</span>
    </div>
  )
}
