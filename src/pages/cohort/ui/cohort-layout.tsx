import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useMatchRoute, useRouteContext, getRouteApi } from '@tanstack/react-router'
import { cohortTint, CohortProvider, type CohortView } from '@/entities/cohort'
import { CohortHeader } from '@/pages/cohort/ui/cohort-header'
import { CohortSkeleton } from '@/pages/cohort/ui/cohort-skeleton'
import { cohortAddress, cohortQueryOptions, publicCodeOf } from '@/shared/api/cohorts'
import { meQueryOptions } from '@/shared/api/session'
import { useFocusChrome } from '@/shared/lib/use-focus-chrome'
import { BackLink } from '@/shared/ui/back-link'
import { DetailError } from '@/shared/ui/detail-error'
import { PageContent } from '@/shared/ui/page-content'

const route = getRouteApi('/_app/classes/$cohortRef')

export function CohortLayout() {
  const { cohortRef } = route.useParams()
  const { accountId } = useRouteContext({ from: '/_app' })
  const { data: me } = useQuery(meQueryOptions(accountId))
  const query = useQuery(cohortQueryOptions(publicCodeOf(cohortRef)))
  const focus = useFocusChrome()
  const matchRoute = useMatchRoute()
  // The submissions tables carry many columns: they take the whole width instead of scrolling sideways.
  const isWide = Boolean(matchRoute({ to: '/classes/$cohortRef/activities/$assessmentSlug/sessions' }))

  if (query.isError) return <DetailError error={query.error} onRetry={() => query.refetch()} />
  if (query.isPending || !me) return <CohortSkeleton />

  const cohort = query.data
  // The code found the cohort; a link with an old or mistyped slug moves to the current address, same page.
  const address = cohortAddress(cohort)
  if (cohortRef !== address) {
    return <Navigate params={(previous) => ({ ...previous, cohortRef: address })} replace to="." />
  }

  const view: CohortView = {
    cohort,
    profileId: me.profile.profileId,
    isOwner: cohort.ownerProfileId === me.profile.profileId,
    isFaculty: me.profile.type === 'FACULTY',
  }

  if (focus) {
    return (
      <CohortProvider value={view}>
        <div {...cohortTint(cohort)} className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </CohortProvider>
    )
  }

  return (
    <CohortProvider value={view}>
      {/* The tabs draw with the cohort's colour too; `contents` keeps the layout untouched. */}
      <div {...cohortTint(cohort)} className="contents">
        <PageContent className={isWide ? 'max-w-none' : undefined}>
          <BackLink label="Turmas" to="/classes" />
          <CohortHeader view={view} />
          <Outlet />
        </PageContent>
      </div>
    </CohortProvider>
  )
}
