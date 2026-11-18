import { ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { type Column, columnVisibility } from '@/shared/ui/data-table-column'

export type DataTableRowProps<T> = {
  row: T
  columns: Column<T>[]
  onRowClick?: (row: T) => void
}

export function DataTableRow<T>({ row, columns, onRowClick }: DataTableRowProps<T>) {
  return (
    <tr
      className={cn(
        'group/row h-[3.75rem]',
        onRowClick && 'cursor-pointer transition-colors hover:bg-accent/45 focus-visible:bg-accent/60 focus-visible:outline-none'
      )}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      onKeyDown={
        onRowClick
          ? (event) => {
              if (event.key === 'Enter') onRowClick(row)
            }
          : undefined
      }
      tabIndex={onRowClick ? 0 : undefined}
    >
      {columns.map((column) => (
        <td className={cn('px-4 first:pl-5', column.className, columnVisibility(column))} key={column.id}>
          {column.cell(row)}
        </td>
      ))}
      {onRowClick ? (
        <td className="pr-4 text-right">
          <ChevronRight className="inline size-4 text-muted-foreground/40 transition-[color,translate] group-hover/row:translate-x-0.5 group-hover/row:text-foreground group-focus-visible/row:text-foreground" />
        </td>
      ) : null}
    </tr>
  )
}
