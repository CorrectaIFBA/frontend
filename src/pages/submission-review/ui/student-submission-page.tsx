import { useQuery } from '@tanstack/react-query'
import { ClipboardPen } from 'lucide-react'
import { useState } from 'react'
import { Navigate, getRouteApi, useRouterState } from '@tanstack/react-router'
import { useCohortView } from '@/entities/cohort'
import { AccountAvatar } from '@/entities/profile'
import { GradeSheet } from '@/features/grade-attempt'
import { GradeTotal, summarizeGrades } from '@/entities/grade'
import { ReviewBackLink } from '@/pages/submission-review/ui/review-back-link'
import { ReviewNotice } from '@/pages/submission-review/ui/review-notice'
import { assessmentBySlugQueryOptions, questionsQueryOptions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { sessionQueryOptions } from '@/shared/api/sessions'
import { studentGradesQueryOptions } from '@/shared/api/grades'
import { submittedWorkspacesQueryOptions } from '@/shared/api/workspaces'
import { Button } from '@/shared/ui/button'
import { SolveSkeleton, SubmissionReview, useSubmissionResults } from '@/widgets/solve'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/submissions/$sessionId')

/*
  One student's attempt, for the cohort's faculty: the code handed in for
  each question, beside every test case with its input and expected output,
  evaluation cases included. The student's name comes from the submissions
  table that opened the page; a pasted link shows a generic label.
*/
export function StudentSubmissionPage() {
  const { assessmentSlug, sessionId } = route.useParams()
  const { question: questionSlug } = route.useSearch()
  const studentName = useRouterState({ select: (state) => state.location.state.studentName })
  const { cohort, isFaculty } = useCohortView()
  const assessment = useQuery(assessmentBySlugQueryOptions(cohort.id, assessmentSlug))
  const assessmentId = assessment.data?.id ?? ''
  const session = useQuery({ ...sessionQueryOptions(assessmentId, sessionId), enabled: isFaculty && Boolean(assessmentId) })
  const studentProfileId = session.data?.studentProfileId
  const questions = useQuery({ ...questionsQueryOptions(assessmentId), enabled: Boolean(studentProfileId) })
  const workspaces = useQuery({
    ...submittedWorkspacesQueryOptions(assessmentId, studentProfileId),
    enabled: Boolean(studentProfileId),
  })
  const results = useSubmissionResults(assessmentId, studentProfileId, workspaces.data, Boolean(studentProfileId))
  const params = { cohortRef: cohortAddress(cohort), assessmentSlug }
  const [isGrading, setIsGrading] = useState(false)
  const grades = useQuery({ ...studentGradesQueryOptions(assessmentId, studentProfileId ?? ''), enabled: Boolean(studentProfileId) })

  if (!isFaculty) return <Navigate params={params} replace to="/classes/$cohortRef/activities/$assessmentSlug" />

  const error = assessment.error ?? session.error ?? questions.error ?? workspaces.error
  if (error) return <ReviewNotice message={errorMessage(error)} />
  if (!assessment.data || !session.data || !questions.data || !workspaces.data) return <SolveSkeleton />

  const name = studentName ?? 'Estudante'

  return (
    <>
      <SubmissionReview
        actions={
          <>
            {grades.data ? (
              <GradeTotal
                className="px-1"
                showsLabel
                summary={summarizeGrades(questions.data, new Map(grades.data.map((grade) => [grade.questionId, grade])))}
              />
            ) : null}
            <Button onClick={() => setIsGrading(true)} size="sm">
              <ClipboardPen />
              Atribuir notas
            </Button>
          </>
        }
        assessment={assessment.data}
        backLink={<ReviewBackLink label="Envios" params={params} to="/classes/$cohortRef/activities/$assessmentSlug/sessions" />}
        owner={
          <>
            <AccountAvatar className="size-6 shrink-0" name={name} type="STUDENT" variant="soft" />
            <span className="truncate font-medium">{name}</span>
          </>
        }
        grades={grades.data}
        questionSlug={questionSlug}
        results={results.data}
        questions={questions.data}
        session={session.data}
        showsEveryTestcase
        workspaces={workspaces.data}
      />
      <GradeSheet
        assessmentId={assessment.data.id}
        onClose={() => setIsGrading(false)}
        studentName={name}
        studentProfileId={isGrading ? session.data.studentProfileId : null}
      />
    </>
  )
}
