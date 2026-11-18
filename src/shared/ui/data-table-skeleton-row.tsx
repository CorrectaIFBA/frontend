import { cn } from '@/shared/lib/cn'
import { type Column, columnVisibility } from '@/shared/ui/data-table-column'
import { Skeleton } from '@/shared/ui/skeleton'

export type DataTableSkeletonRowProps<T> = {
  columns: Column<T>[]
  hasRowAction: boolean
}

export function DataTableSkeletonRow<T>({ columns, hasRowAction }: DataTableSkeletonRowProps<T>) {
  return (
    <tr>
      {columns.map((column) => (
        <td className={cn('h-[3.75rem] px-4 first:pl-5', columnVisibility(column))} key={column.id}>
          {column.skeleton ?? <Skeleton className="h-3 w-3/4 max-w-32" />}
        </td>
      ))}
      {hasRowAction ? <td /> : null}
    </tr>
  )
}
