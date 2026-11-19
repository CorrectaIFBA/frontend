import { useQuery } from '@tanstack/react-query'
import { type Cohort, cohortsQueryOptions } from '@/shared/api/cohorts'

/** The signed-in profile's cohorts by id, to turn a session's cohort id into a link. */
export function useMyCohortsById() {
  const query = useQuery(
    cohortsQueryOptions({}, { page: 0, size: 100, sortBy: 'createdAt', sortDirection: 'desc' })
  )

  return new Map<string, Cohort>((query.data?.content ?? []).map((cohort) => [cohort.id, cohort]))
}
