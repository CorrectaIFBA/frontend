import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import type { SubmissionsSearch } from '@/pages/activity-sessions/lib/parse-submissions-search'
import type { SortDirection } from '@/shared/api/directory'
import { type RosterGroup, type RosterSortField, sessionRosterQueryOptions } from '@/shared/api/sessions'
import { PAGE_SIZE } from '@/shared/lib/list-search'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/sessions')

const REFRESH_MS = 15_000

/** Where each table keeps its page and order in the URL, and how it starts. */
const TABLE_KEYS = {
  FINISHED: { page: 'page', sort: 'sort', dir: 'dir', defaultSort: 'finishedAt' },
  OPEN: { page: 'openPage', sort: 'openSort', dir: 'openDir', defaultSort: 'startedAt' },
} as const satisfies Record<RosterGroup, { page: keyof SubmissionsSearch; sort: keyof SubmissionsSearch; dir: keyof SubmissionsSearch; defaultSort: RosterSortField }>

/** One roster table: its query, its order and the handlers that move them in the URL. */
export function useRosterTable(assessmentId: string, group: RosterGroup) {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const keys = TABLE_KEYS[group]
  const sort = search[keys.sort] ?? keys.defaultSort
  const dir = search[keys.dir] ?? 'desc'
  const query = useQuery({
    ...sessionRosterQueryOptions(
      assessmentId,
      { group, search: search.q },
      { page: (search[keys.page] ?? 1) - 1, size: PAGE_SIZE, sortBy: sort, sortDirection: dir }
    ),
    refetchInterval: REFRESH_MS,
  })

  return {
    query,
    sort,
    dir,
    onPage: (page: number) => navigate({ search: (previous) => ({ ...previous, [keys.page]: page }) }),
    onSort: (nextSort: string, nextDir: SortDirection) =>
      navigate({
        search: (previous) => ({ ...previous, [keys.sort]: nextSort, [keys.dir]: nextDir, [keys.page]: undefined }),
      }),
  }
}

/** The search box serves both tables, so a new term sends both back to their first page. */
export function useRosterSearch() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const onSearch = useCallback(
    (term: string) =>
      navigate({ search: (previous) => ({ ...previous, q: term || undefined, page: undefined, openPage: undefined }) }),
    [navigate]
  )

  return { term: search.q ?? '', onSearch }
}
