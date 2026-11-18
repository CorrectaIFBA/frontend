import { queryOptions } from '@tanstack/react-query'
import { EVALUATION_API_URL, type PreviewStatus, type PreviewTestCase } from '@/shared/api/evaluations'
import { authedRequest } from '@/shared/api/session'

/*
  Final evaluation of each question a student handed in: the latest
  submission of the question, run against every test case once.

    GET /api/evaluation/evaluations/assessment/{assessmentId}/results[?profileId=]

  Students get the status and the percentage only, and the percentage only
  when the activity shows them their score. The cohort's faculty also
  get the counts, the compilation outcome and every test case result.
*/

export type SubmissionResult = {
  questionId: string
  evaluationId: string
  submissionId: string
  revision: number
  status: PreviewStatus
  /** Share of the test cases that passed, 0 to 100. `null` until the evaluation completes. */
  percentage: number | null
  /** Faculty only. */
  passedCount: number | null
  /** Faculty only. */
  totalCount: number | null
  /** Faculty only. */
  compilationSucceeded: boolean | null
  /** Faculty only. */
  compilationMessage: string | null
  /** Faculty only: why the evaluation failed. */
  errorMessage: string | null
  /** Faculty only, every type. */
  testCases: PreviewTestCase[] | null
  evaluatedAt: string
}

export const submissionResultsQueryOptions = (assessmentId: string, studentProfileId?: string) =>
  queryOptions({
    queryKey: ['evaluations', 'results', assessmentId, studentProfileId ?? 'mine'] as const,
    queryFn: ({ signal }) => {
      const query = studentProfileId ? `?profileId=${encodeURIComponent(studentProfileId)}` : ''

      return authedRequest<SubmissionResult[]>(`/evaluations/assessment/${encodeURIComponent(assessmentId)}/results${query}`, {
        baseUrl: EVALUATION_API_URL,
        signal,
      })
    },
  })

/*
  The result of a whole attempt: the mean of every question's percentage, a
  question without a final evaluation counting as 0.

    GET /api/evaluation/evaluations/assessment/{assessmentId}/results/summary   (the caller's own)
    GET /api/evaluation/evaluations/assessment/{assessmentId}/results/students  (faculty: every student)

  Only faculty get `questions`. Both ask again while an evaluation runs.
*/

/**
 * `PENDING` while an evaluation runs; `UNAVAILABLE` when one ended without a result, or there are no questions;
 * `HIDDEN` when the activity does not show students their score.
 */
export type ResultSummaryStatus = 'PENDING' | 'READY' | 'UNAVAILABLE' | 'HIDDEN'

export type QuestionScore = {
  questionId: string
  position: number
  title: string
  /** `null` when the question has no final evaluation. */
  status: PreviewStatus | 'AWAITING_REVIEW' | null
  /** 0 to 100; 0 without an evaluation, `null` until the evaluation completes. */
  percentage: number | null
}

export type ResultSummary = {
  studentProfileId: string
  status: ResultSummaryStatus
  /** 0 to 100, only when `READY`. */
  percentage: number | null
  /** Faculty only, ordered by position. */
  questions: QuestionScore[] | null
}

const SUMMARY_POLL_INTERVAL_MS = 5000

export const resultSummaryQueryOptions = (assessmentId: string) =>
  queryOptions({
    queryKey: ['evaluations', 'results', assessmentId, 'summary'] as const,
    queryFn: ({ signal }) =>
      authedRequest<ResultSummary>(`/evaluations/assessment/${encodeURIComponent(assessmentId)}/results/summary`, {
        baseUrl: EVALUATION_API_URL,
        signal,
      }),
    refetchInterval: (query) => (query.state.data?.status === 'PENDING' ? SUMMARY_POLL_INTERVAL_MS : false),
  })

export const studentResultSummariesQueryOptions = (assessmentId: string) =>
  queryOptions({
    queryKey: ['evaluations', 'results', assessmentId, 'students'] as const,
    queryFn: ({ signal }) =>
      authedRequest<ResultSummary[]>(`/evaluations/assessment/${encodeURIComponent(assessmentId)}/results/students`, {
        baseUrl: EVALUATION_API_URL,
        signal,
      }),
    refetchInterval: (query) =>
      query.state.data?.some((summary) => summary.status === 'PENDING') ? SUMMARY_POLL_INTERVAL_MS : false,
  })
