import type { ReactNode } from 'react'
import type { Assessment, AssessmentQuestion } from '@/shared/api/assessments'
import type { QuestionGrade } from '@/shared/api/grades'
import type { SessionSummary } from '@/shared/api/sessions'
import type { SubmissionResult } from '@/shared/api/submission-results'
import type { SubmittedWorkspace } from '@/shared/api/workspaces'
import { PanelNote } from '@/shared/ui/panel-note'
import { questionResult, summarizeAttempt } from '@/widgets/solve/lib/attempt-result'
import { useReviewNavigation } from '@/widgets/solve/model/use-review-navigation'
import { ReviewHeader } from '@/widgets/solve/ui/review-header'
import { ReviewQuestion } from '@/widgets/solve/ui/review-question'
import { SolveScreen } from '@/widgets/solve/ui/solve-screen'

type SubmissionReviewProps = {
  assessment: Assessment
  questions: AssessmentQuestion[]
  workspaces: SubmittedWorkspace[]
  /** Final evaluations; `undefined` while they load or when they could not be read. */
  results: SubmissionResult[] | undefined
  session: Pick<SessionSummary, 'state' | 'finishedAt' | 'late'>
  /** From the URL; the first question when missing. */
  questionSlug: string | undefined
  /** Faculty see every test case with its values; students what the coding page showed them. */
  showsEveryTestcase: boolean
  /** The activity hides the score from the student: no result is read, and the header says so. */
  isScoreHidden?: boolean
  backLink: ReactNode
  owner: ReactNode
  /** Grades of the attempt; left out when the reader may not see them. */
  grades?: QuestionGrade[]
  /** Buttons beside the owner, at the center of the header. */
  actions?: ReactNode
}

/** A finished attempt, question by question, with the code that was handed in. */
export function SubmissionReview({
  assessment,
  questions,
  workspaces,
  results,
  session,
  questionSlug,
  showsEveryTestcase,
  isScoreHidden = false,
  backLink,
  owner,
  grades,
  actions,
}: SubmissionReviewProps) {
  const workspacesByQuestionId = new Map(workspaces.map((workspace) => [workspace.questionId, workspace]))
  const submittedQuestionIds = new Set(
    workspaces.filter((workspace) => workspace.currentDraft).map((workspace) => workspace.questionId)
  )
  const gradesByQuestionId = new Map(grades?.map((grade) => [grade.questionId, grade]))
  const resultsByQuestionId = new Map(results?.map((result) => [result.questionId, result]))
  const attempt = results ? summarizeAttempt(questions, submittedQuestionIds, resultsByQuestionId) : null
  const index = questionSlug ? questions.findIndex((question) => question.slug === questionSlug) : 0
  const question = questions[index]
  const navigation = useReviewNavigation(questions, index)

  return (
    <SolveScreen>
      <ReviewHeader
        actions={actions}
        attempt={attempt}
        isScoreHidden={isScoreHidden}
        backLink={backLink}
        owner={owner}
        navigation={navigation}
        session={session}
        submittedQuestionIds={submittedQuestionIds}
        title={assessment.title}
      />
      {question ? (
        <ReviewQuestion
          entry={results ? questionResult(question.id, submittedQuestionIds, resultsByQuestionId) : undefined}
          grade={grades ? gradesByQuestionId.get(question.id) : null}
          key={question.id}
          navigation={navigation}
          number={index + 1}
          question={question}
          showsEveryTestcase={showsEveryTestcase}
          workspace={workspacesByQuestionId.get(question.id)}
        />
      ) : (
        <div className="m-auto w-full max-w-md p-4">
          <PanelNote>
            {questions.length ? 'Questão não encontrada. Escolha outra no topo da página.' : 'Esta atividade não tem questões.'}
          </PanelNote>
        </div>
      )}
    </SolveScreen>
  )
}
