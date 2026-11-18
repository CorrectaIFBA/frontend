import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { SubmissionResult } from '@/shared/api/submission-results'
import type { SubmittedWorkspace } from '@/shared/api/workspaces'

/** Where one question's final evaluation stands. */
export type QuestionResult =
  | { kind: 'not-submitted' }
  /** Handed in, but its evaluation has not been created yet. */
  | { kind: 'awaiting' }
  | { kind: 'evaluated'; result: SubmissionResult }

export type AttemptResult = {
  /** `pending` while some evaluation runs; `unavailable` when one ended without a result. */
  state: 'pending' | 'unavailable' | 'ready'
  /** Mean of the questions' percentages; a question without code counts as 0. */
  percentage: number | null
  /** Faculty only: test cases passed and run, over every evaluated question. */
  passedCount: number | null
  totalCount: number | null
}

export function questionResult(
  questionId: string,
  submittedQuestionIds: Set<string>,
  resultsByQuestionId: Map<string, SubmissionResult>
): QuestionResult {
  const result = resultsByQuestionId.get(questionId)
  if (result) return { kind: 'evaluated', result }

  return submittedQuestionIds.has(questionId) ? { kind: 'awaiting' } : { kind: 'not-submitted' }
}

export const isEvaluationRunning = (result: SubmissionResult) => result.status === 'QUEUED' || result.status === 'RUNNING'

export function summarizeAttempt(
  questions: AssessmentQuestion[],
  submittedQuestionIds: Set<string>,
  resultsByQuestionId: Map<string, SubmissionResult>
): AttemptResult {
  const questionResults = questions.map((question) => questionResult(question.id, submittedQuestionIds, resultsByQuestionId))
  const evaluated = questionResults.flatMap((entry) => (entry.kind === 'evaluated' ? [entry.result] : []))
  const isPending = questionResults.some((entry) => entry.kind === 'awaiting') || evaluated.some(isEvaluationRunning)
  const isUnavailable = evaluated.some((result) => result.percentage === null && !isEvaluationRunning(result))
  const hasCounts = evaluated.some((result) => result.totalCount !== null)

  if (isPending || isUnavailable || !questions.length) {
    return { state: isPending ? 'pending' : 'unavailable', percentage: null, passedCount: null, totalCount: null }
  }

  const percentages = questionResults.map((entry) => (entry.kind === 'evaluated' ? (entry.result.percentage ?? 0) : 0))

  return {
    state: 'ready',
    percentage: percentages.reduce((sum, percentage) => sum + percentage, 0) / questions.length,
    passedCount: hasCounts ? evaluated.reduce((sum, result) => sum + (result.passedCount ?? 0), 0) : null,
    totalCount: hasCounts ? evaluated.reduce((sum, result) => sum + (result.totalCount ?? 0), 0) : null,
  }
}

/** Whether a result list still lacks the evaluation of some handed-in question. */
export function isAwaitingResults(results: SubmissionResult[] | undefined, workspaces: SubmittedWorkspace[] | undefined) {
  if (!results || !workspaces) return false

  const evaluatedIds = new Set(results.map((result) => result.questionId))

  return (
    results.some(isEvaluationRunning) ||
    workspaces.some((workspace) => workspace.currentDraft && !evaluatedIds.has(workspace.questionId))
  )
}
