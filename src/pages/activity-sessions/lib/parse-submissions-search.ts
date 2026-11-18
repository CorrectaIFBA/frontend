import { ROSTER_SORT_FIELDS, type RosterSortField } from '@/shared/api/sessions'
import type { SortDirection } from '@/shared/api/directory'
import { pickEnum } from '@/shared/lib/list-search'

/**
 * Both tables keep their place in the URL. The search box serves the two;
 * the finished table uses the plain keys, the open table the `open*` ones.
 */
export type SubmissionsSearch = {
  q?: string
  page?: number
  sort?: RosterSortField
  dir?: SortDirection
  openPage?: number
  openSort?: RosterSortField
  openDir?: SortDirection
}

const DIRECTIONS = ['asc', 'desc'] as const

function pickPage(value: unknown) {
  const page = Number(value)
  return Number.isInteger(page) && page > 1 ? page : undefined
}

export function parseSubmissionsSearch(raw: Record<string, unknown>): SubmissionsSearch {
  return {
    q: typeof raw.q === 'string' && raw.q.trim() ? raw.q : undefined,
    page: pickPage(raw.page),
    sort: pickEnum(raw.sort, ROSTER_SORT_FIELDS),
    dir: pickEnum(raw.dir, DIRECTIONS),
    openPage: pickPage(raw.openPage),
    openSort: pickEnum(raw.openSort, ROSTER_SORT_FIELDS),
    openDir: pickEnum(raw.openDir, DIRECTIONS),
  }
}
