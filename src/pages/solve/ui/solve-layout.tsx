import { useQuery } from '@tanstack/react-query'
import { Navigate, getRouteApi } from '@tanstack/react-router'
import { useCohortView } from '@/entities/cohort'
import { Workspace } from '@/pages/solve/ui/workspace'
import { assessmentBySlugQueryOptions, questionsQueryOptions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { mySessionQueryOptions } from '@/shared/api/sessions'
import { PanelNote } from '@/shared/ui/panel-note'
import { SolveScreen, SolveSkeleton } from '@/widgets/solve'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/solve')

/*
  The coding page exists only while the student's session runs. Without a
  session, with a finished one, or for faculty, it sends back to the
  activity page, which explains why.
*/
export function SolveLayout() {
  const { assessmentSlug } = route.useParams()
  const { cohort, isFaculty } = useCohortView()
  const assessment = useQuery(assessmentBySlugQueryOptions(cohort.id, assessmentSlug))
  const assessmentId = assessment.data?.id
  // Always re-read on arrival: leaving on a stale "ended" (after a reopen, say) bounces the student back and forth.
  const session = useQuery({
    ...mySessionQueryOptions(assessmentId ?? ''),
    enabled: Boolean(assessmentId),
    refetchOnMount: 'always',
  })
  const questions = useQuery({ ...questionsQueryOptions(assessmentId ?? ''), enabled: Boolean(session.data) })
  const toActivity = (
    <Navigate
      params={{ cohortRef: cohortAddress(cohort), assessmentSlug }}
      replace
      to="/classes/$cohortRef/activities/$assessmentSlug"
    />
  )

  if (isFaculty) return toActivity

  const error = assessment.error ?? session.error ?? questions.error
  if (error) {
    return (
      <SolveScreen>
        <div className="m-auto w-full max-w-md p-4">
          <PanelNote>{errorMessage(error)}</PanelNote>
        </div>
      </SolveScreen>
    )
  }

  const ended = session.data === null || (session.data && session.data.state !== 'IN_PROGRESS')
  if (ended && session.isFetching) return <SolveSkeleton />
  if (ended) return toActivity
  if (!assessment.data || !session.data || !questions.data) return <SolveSkeleton />

  return <Workspace assessment={assessment.data} questions={questions.data} session={session.data} />
}
