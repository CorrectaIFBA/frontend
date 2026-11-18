import { PendingInvitations } from '@/features/accept-invitation'
import { useCohortList } from '@/pages/cohorts/model/use-cohort-list'
import { CohortFilters } from '@/pages/cohorts/ui/cohort-filters'
import { CohortResults } from '@/pages/cohorts/ui/cohort-results'
import { CohortsPageTitle } from '@/pages/cohorts/ui/cohorts-page-title'
import { PageContent } from '@/shared/ui/page-content'

export function CohortsPage() {
  const list = useCohortList()
  const isMember = Boolean(list.profileType && list.profileType !== 'STAFF')

  return (
    <PageContent>
      <CohortsPageTitle profileType={list.profileType} />
      {isMember ? <PendingInvitations /> : null}
      <CohortFilters list={list} />
      <CohortResults list={list} />
    </PageContent>
  )
}
