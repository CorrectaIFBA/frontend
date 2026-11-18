import { useQuery } from '@tanstack/react-query'
import { getRouteApi, useRouteContext } from '@tanstack/react-router'
import { dayEnd, dayStart } from '@/pages/cohorts/lib/day-range'
import { type CohortListSearch, PAGE_SIZE, SORTS } from '@/pages/cohorts/model/cohort-list-search'
import { cohortsQueryOptions } from '@/shared/api/cohorts'
import { meQueryOptions } from '@/shared/api/session'
import { toPagination } from '@/shared/lib/list-search'

const route = getRouteApi('/_app/classes/')

/* The cohort list as the URL filters it, and the signed-in profile that decides what the page offers. */
export function useCohortList() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { accountId } = useRouteContext({ from: '/_app' })
  const { data: me } = useQuery(meQueryOptions(accountId))
  const profileType = me?.profile.type
  const pagination = { ...toPagination(search), size: PAGE_SIZE }

  const query = useQuery(
    cohortsQueryOptions(
      {
        status: search.status,
        mine: search.mine,
        search: search.q,
        createdAfter: search.from ? dayStart(search.from) : undefined,
        createdBefore: search.to ? dayEnd(search.to) : undefined,
      },
      pagination
    )
  )

  const onSearch = (next: Partial<CohortListSearch>) => navigate({ search: (previous) => ({ ...previous, ...next }) })
  const sort =
    SORTS.find((option) => option.sort === pagination.sortBy && option.dir === pagination.sortDirection) ?? SORTS[0]
  const isFiltered = Boolean(search.q || search.status || search.mine || search.from || search.to)

  return { search, onSearch, me, profileType, isFaculty: profileType === 'FACULTY', query, sort, isFiltered }
}

export type CohortList = ReturnType<typeof useCohortList>
