import type { CohortState } from '@/shared/api/cohorts'
import type { ListSearch } from '@/shared/lib/list-search'

export type CohortListSearch = ListSearch & {
  status?: CohortState
  mine?: boolean
  from?: string
  to?: string
}

const DAY = /^\d{4}-\d{2}-\d{2}$/

export const pickDay = (value: unknown) => (typeof value === 'string' && DAY.test(value) ? value : undefined)

/* A card grid fills its rows at 1, 2 and 3 columns. */
export const PAGE_SIZE = 12

export const SORTS = [
  { id: 'recent', label: 'Criadas recentemente', sort: 'createdAt', dir: 'desc' },
  { id: 'oldest', label: 'Criadas há mais tempo', sort: 'createdAt', dir: 'asc' },
  { id: 'updated', label: 'Alteradas recentemente', sort: 'updatedAt', dir: 'desc' },
  { id: 'alpha', label: 'Ordem alfabética', sort: 'slug', dir: 'asc' },
] as const
