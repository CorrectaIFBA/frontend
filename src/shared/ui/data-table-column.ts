import type { ReactNode } from 'react'

export type Column<T> = {
  id: string
  header: string
  /** The API's `sortBy` value; columns without one cannot be sorted. */
  sortKey?: string
  className?: string
  /** Hidden below this breakpoint, so narrow screens keep the columns that identify a row. */
  hideBelow?: 'sm' | 'md' | 'lg'
  cell: (row: T) => ReactNode
  /** What the cell looks like while the page loads; a short bar by default. */
  skeleton?: ReactNode
}

const HIDE_BELOW = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
}

export function columnVisibility<T>(column: Column<T>) {
  return column.hideBelow && HIDE_BELOW[column.hideBelow]
}
