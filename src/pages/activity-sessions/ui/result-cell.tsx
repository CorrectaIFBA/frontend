import { useQuery } from '@tanstack/react-query'
import { ResultScore } from '@/entities/evaluation'
import { studentResultSummariesQueryOptions } from '@/shared/api/submission-results'

/*
  The share of test cases the attempt passed, averaged over the questions;
  hovering lists each question. Every row reads the same query, so the
  board asks once. A student absent from the summaries handed in no code.
*/
export function ResultCell({ assessmentId, studentProfileId }: { assessmentId: string; studentProfileId: string }) {
  const query = useQuery(studentResultSummariesQueryOptions(assessmentId))

  if (query.isError) return <span className="text-muted-foreground/60">—</span>
  if (!query.data) return null

  const summary = query.data.find((entry) => entry.studentProfileId === studentProfileId)

  return <ResultScore summary={summary ?? { studentProfileId, status: 'READY', percentage: 0, questions: null }} />
}
