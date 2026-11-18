import type { UseQueryResult } from '@tanstack/react-query'
import { CircleAlert, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Paged, SortDirection } from '@/shared/api/directory'
import { errorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import type { Column } from '@/shared/ui/data-table-column'
import { DataTableHead } from '@/shared/ui/data-table-head'
import { DataTableRow } from '@/shared/ui/data-table-row'
import { DataTableSkeletonRow } from '@/shared/ui/data-table-skeleton-row'
import { Pager } from '@/shared/ui/pager'
import { TableNotice } from '@/shared/ui/table-notice'

export type DataTableProps<T> = {
  columns: Column<T>[]
  query: UseQueryResult<Paged<T>>
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  sort: string
  dir: SortDirection
  onSort: (sortKey: string, dir: SortDirection) => void
  onPage: (page: number) => void
  emptyTitle: string
  emptyHint?: string
  emptyAction?: ReactNode
}

/**
 * A server-paged table. Sorting and paging are owned by the caller (the URL),
 * so the table only reports what was clicked.
 */
export function DataTable<T>({
  columns,
  query,
  rowKey,
  onRowClick,
  sort,
  dir,
  onSort,
  onPage,
  emptyTitle,
  emptyHint,
  emptyAction,
}: DataTableProps<T>) {
  const data = query.data
  const hasRowAction = Boolean(onRowClick)

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_oklch(0_0_0/0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <DataTableHead columns={columns} dir={dir} hasRowAction={hasRowAction} onSort={onSort} sort={sort} />
          <tbody
            className={cn(
              'transition-opacity [&>tr+tr]:border-border/70 [&>tr+tr]:border-t',
              query.isPlaceholderData && 'opacity-55'
            )}
          >
            {query.isPending
              ? Array.from({ length: 8 }, (_, index) => (
                  <DataTableSkeletonRow columns={columns} hasRowAction={hasRowAction} key={`skeleton-${index + 1}`} />
                ))
              : data?.content.map((row) => (
                  <DataTableRow columns={columns} key={rowKey(row)} onRowClick={onRowClick} row={row} />
                ))}
          </tbody>
        </table>
      </div>

      {query.isError ? (
        <TableNotice
          action={
            <Button onClick={() => query.refetch()} size="sm" variant="outline">
              Tentar novamente
            </Button>
          }
          hint={errorMessage(query.error)}
          icon={<CircleAlert className="size-5" strokeWidth={1.75} />}
          title="Não foi possível carregar a lista"
        />
      ) : data && data.content.length === 0 ? (
        <TableNotice
          action={emptyAction}
          hint={emptyHint}
          icon={<SearchX className="size-5" strokeWidth={1.75} />}
          title={emptyTitle}
        />
      ) : null}

      {data && data.totalElements > 0 ? <Pager data={data} onPage={onPage} /> : null}
    </div>
  )
}
