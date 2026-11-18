import { useQuery } from '@tanstack/react-query'
import { ResultScore } from '@/entities/evaluation'
import { resultSummaryQueryOptions } from '@/shared/api/submission-results'

/** The signed-in student's result in a finished attempt. The caller checks the activity lets them see it. */
export function MyResultScore({ assessmentId, className }: { assessmentId: string; className?: string }) {
  const query = useQuery(resultSummaryQueryOptions(assessmentId))

  return <ResultScore className={className} summary={query.data} />
}
