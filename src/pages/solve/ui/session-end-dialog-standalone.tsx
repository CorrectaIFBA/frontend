import { useCohortView } from '@/entities/cohort'
import { useCodingSession } from '@/entities/session'
import type { DraftSyncer } from '@/entities/workspace'
import type { Assessment, AssessmentQuestion } from '@/shared/api/assessments'
import { SolveProvider, SessionEndDialog } from '@/widgets/solve'
/* The session can end while the page waits for its workspaces; the end dialog still has to show. */
export function SessionEndDialogStandalone({
  assessment,
  questions,
  coding,
}: {
  assessment: Assessment
  questions: AssessmentQuestion[]
  coding: ReturnType<typeof useCodingSession>
}) {
  const { cohort } = useCohortView()
  const value = {
    cohort,
    assessment,
    questions,
    coding,
    written: new Set<string>(),
    markWritten: () => {},
    syncers: new Map<string, DraftSyncer>(),
    flushAll: async () => [],
  }
  return (
    <SolveProvider value={value}>
      <SessionEndDialog />
    </SolveProvider>
  )
}
