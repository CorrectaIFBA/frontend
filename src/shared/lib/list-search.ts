import type { Pagination, SortDirection } from '@/shared/api/directory'

export const PAGE_SIZE = 20

/**
 * What a list page keeps in its URL, so a filtered, sorted page can be
 * reloaded, shared or reached again with the back button. `page` is 1-based
 * here and 0-based on the API.
 */
export type ListSearch = {
  q?: string
  page?: number
  sort?: string
  dir?: SortDirection
}

export function parseListSearch(raw: Record<string, unknown>, sortFields: readonly string[]): ListSearch {
  const page = Number(raw.page)
  return {
    q: typeof raw.q === 'string' && raw.q.trim() ? raw.q : undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
    sort: typeof raw.sort === 'string' && sortFields.includes(raw.sort) ? raw.sort : undefined,
    dir: raw.dir === 'asc' || raw.dir === 'desc' ? raw.dir : undefined,
  }
}

export function pickEnum<T extends string>(value: unknown, options: readonly T[]): T | undefined {
  return options.includes(value as T) ? (value as T) : undefined
}

export function toPagination(search: ListSearch, defaultSort = 'createdAt'): Pagination {
  return {
    page: (search.page ?? 1) - 1,
    size: PAGE_SIZE,
    sortBy: search.sort ?? defaultSort,
    sortDirection: search.dir ?? 'desc',
  }
}
