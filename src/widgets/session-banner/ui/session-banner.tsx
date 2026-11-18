import { useQuery } from '@tanstack/react-query'
import { useMyCohortsById } from '@/entities/cohort'
import { mySessionsQueryOptions } from '@/shared/api/sessions'
import { BannerRow } from '@/widgets/session-banner/ui/banner-row'

/*
  A running activity with a deadline follows the student around the app, so
  leaving the coding page never means losing track of the clock. It hides on
  the coding page itself, which has its own header.
*/
export function SessionBanner() {
  const query = useQuery({
    ...mySessionsQueryOptions('IN_PROGRESS', { page: 0, size: 5, sortBy: 'startedAt', sortDirection: 'desc' }),
    refetchInterval: 60_000,
  })
  const cohorts = useMyCohortsById()
  const session = query.data?.content.find((candidate) => candidate.expiresAt)
  const cohort = session?.cohortId ? cohorts.get(session.cohortId) : undefined

  if (!session || !cohort) return null
  return <BannerRow cohort={cohort} session={session} />
}
