import { useQuery } from '@tanstack/react-query'
import { Navigate, getRouteApi } from '@tanstack/react-router'
import { useCohortView } from '@/entities/cohort'
import { SubmissionsBoard } from '@/pages/activity-sessions/ui/submissions-board'
import { assessmentBySlugQueryOptions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { BackLink } from '@/shared/ui/back-link'
import { PanelNote } from '@/shared/ui/panel-note'
import { Skeleton } from '@/shared/ui/skeleton'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/sessions')

/*
  Every student of the cohort against this activity: who has not started,
  who is on the page right now, and how each attempt ended. Faculty act on
  attempts from here: more time, an early end, another chance.
*/
export function SessionsPage() {
  const { assessmentSlug } = route.useParams()
  const { cohort, isFaculty } = useCohortView()
  const assessment = useQuery(assessmentBySlugQueryOptions(cohort.id, assessmentSlug))
  const back = (
    <BackLink
      label={assessment.data?.title ?? 'Atividade'}
      params={{ cohortRef: cohortAddress(cohort), assessmentSlug }}
      to="/classes/$cohortRef/activities/$assessmentSlug"
    />
  )

  if (!isFaculty) {
    return <Navigate params={{ cohortRef: cohortAddress(cohort), assessmentSlug }} replace to="/classes/$cohortRef/activities/$assessmentSlug" />
  }

  return (
    <div className="flex flex-col gap-4">
      {back}
      {assessment.isError ? (
        <PanelNote>{errorMessage(assessment.error)}</PanelNote>
      ) : assessment.isPending ? (
        <Skeleton className="h-80 w-full rounded-lg" />
      ) : (
        <SubmissionsBoard assessment={assessment.data} />
      )}
    </div>
  )
}
