import { useQuery } from '@tanstack/react-query'
import { submissionResultsQueryOptions } from '@/shared/api/submission-results'
import type { SubmittedWorkspace } from '@/shared/api/workspaces'
import { isAwaitingResults } from '@/widgets/solve/lib/attempt-result'

const POLL_INTERVAL_MS = 5000

/*
  The final evaluations of a finished attempt. They run after the hand-in,
  so the page asks again until every handed-in question has its result.
*/
export function useSubmissionResults(
  assessmentId: string,
  studentProfileId: string | undefined,
  workspaces: SubmittedWorkspace[] | undefined,
  enabled: boolean
) {
  return useQuery({
    ...submissionResultsQueryOptions(assessmentId, studentProfileId),
    enabled,
    refetchInterval: (query) => (isAwaitingResults(query.state.data, workspaces) ? POLL_INTERVAL_MS : false),
  })
}
