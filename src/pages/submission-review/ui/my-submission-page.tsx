import { useQuery } from '@tanstack/react-query'
import { Navigate, getRouteApi } from '@tanstack/react-router'
import { showsScore } from '@/entities/assessment'
import { useCohortView } from '@/entities/cohort'
import { GradeTotal, summarizeGrades } from '@/entities/grade'
import { ReviewBackLink } from '@/pages/submission-review/ui/review-back-link'
import { ReviewNotice } from '@/pages/submission-review/ui/review-notice'
import { assessmentBySlugQueryOptions, DEFAULT_PARAMETERS, questionsQueryOptions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { studentGradesQueryOptions } from '@/shared/api/grades'
import { mySessionQueryOptions } from '@/shared/api/sessions'
import { resultSummaryQueryOptions } from '@/shared/api/submission-results'
import { submittedWorkspacesQueryOptions } from '@/shared/api/workspaces'
import { SolveSkeleton, SubmissionReview, useSubmissionResults } from '@/widgets/solve'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/submission')

/*
  The student's own finished attempt: the code they handed in for each
  question, beside the test cases the coding page showed them. Before the
  attempt ends there is nothing to review, so the page sends them on.
*/
export function MySubmissionPage() {
  const { assessmentSlug } = route.useParams()
  const { question: questionSlug } = route.useSearch()
  const { cohort, isFaculty } = useCohortView()
  const assessment = useQuery(assessmentBySlugQueryOptions(cohort.id, assessmentSlug))
  const assessmentId = assessment.data?.id ?? ''
  const session = useQuery({ ...mySessionQueryOptions(assessmentId), enabled: Boolean(assessmentId) })
  const isFinished = Boolean(session.data && session.data.state !== 'IN_PROGRESS')
  const questions = useQuery({ ...questionsQueryOptions(assessmentId), enabled: isFinished })
  const workspaces = useQuery({ ...submittedWorkspacesQueryOptions(assessmentId), enabled: isFinished })
  const isScoreShown = assessment.data ? showsScore(assessment.data) : true
  // The summary says whether the score waits for the grades; it answers HIDDEN until every question has one.
  const summary = useQuery({ ...resultSummaryQueryOptions(assessmentId), enabled: isFinished && isScoreShown })
  // The service hides the percentages too; without them there is nothing to read.
  const isScoreHidden = !isScoreShown || summary.data?.status === 'HIDDEN'
  const showsGrades = (assessment.data?.parameters ?? DEFAULT_PARAMETERS).showAssignedGrades
  const grades = useQuery({
    ...studentGradesQueryOptions(assessmentId, session.data?.studentProfileId ?? ''),
    enabled: isFinished && showsGrades,
  })
  const results = useSubmissionResults(assessmentId, undefined, workspaces.data, isFinished && !isScoreHidden)
  const params = { cohortRef: cohortAddress(cohort), assessmentSlug }

  if (isFaculty) return <Navigate params={params} replace to="/classes/$cohortRef/activities/$assessmentSlug" />

  const error = assessment.error ?? session.error ?? questions.error ?? workspaces.error
  if (error) return <ReviewNotice message={errorMessage(error)} />

  if (session.data === null) return <Navigate params={params} replace to="/classes/$cohortRef/activities/$assessmentSlug" />
  if (session.data?.state === 'IN_PROGRESS') {
    return <Navigate params={params} replace to="/classes/$cohortRef/activities/$assessmentSlug/solve" />
  }
  if (!assessment.data || !session.data || !questions.data || !workspaces.data) return <SolveSkeleton />

  return (
    <SubmissionReview
      actions={
        grades.data ? (
          <GradeTotal
            className="px-1"
            showsLabel
            summary={summarizeGrades(questions.data, new Map(grades.data.map((grade) => [grade.questionId, grade])))}
          />
        ) : null
      }
      assessment={assessment.data}
      grades={grades.data}
      backLink={<ReviewBackLink label="Atividade" params={params} to="/classes/$cohortRef/activities/$assessmentSlug" />}
      owner={<span className="truncate font-medium">Seu envio</span>}
      questionSlug={questionSlug}
      results={results.data}
      questions={questions.data}
      session={session.data}
      isScoreHidden={isScoreHidden}
      showsEveryTestcase={false}
      workspaces={workspaces.data}
    />
  )
}
