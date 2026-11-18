import type { SortDirection } from '@/shared/api/directory'
import { cn } from '@/shared/lib/cn'
import { type Column, columnVisibility } from '@/shared/ui/data-table-column'
import { SortButton } from '@/shared/ui/sort-button'

export type DataTableHeadProps<T> = {
  columns: Column<T>[]
  sort: string
  dir: SortDirection
  onSort: (sortKey: string, dir: SortDirection) => void
  hasRowAction: boolean
}

export function DataTableHead<T>({ columns, sort, dir, onSort, hasRowAction }: DataTableHeadProps<T>) {
  return (
    <thead>
      <tr className="border-border border-b">
        {columns.map((column) => (
          <th
            aria-sort={
              column.sortKey && sort === column.sortKey ? (dir === 'asc' ? 'ascending' : 'descending') : undefined
            }
            className={cn(
              'h-10 whitespace-nowrap px-4 text-left font-medium text-muted-foreground text-xs first:pl-5',
              column.className,
              columnVisibility(column)
            )}
            key={column.id}
            scope="col"
          >
            {column.sortKey ? (
              <SortButton
                active={sort === column.sortKey}
                dir={dir}
                label={column.header}
                onClick={() =>
                  onSort(column.sortKey as string, sort === column.sortKey && dir === 'asc' ? 'desc' : 'asc')
                }
              />
            ) : (
              column.header
            )}
          </th>
        ))}
        {hasRowAction ? <th aria-hidden className="w-10" /> : null}
      </tr>
    </thead>
  )
}
