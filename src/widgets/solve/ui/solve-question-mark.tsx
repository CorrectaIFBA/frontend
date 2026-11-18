import { type DraftSyncer, useSyncState } from '@/entities/workspace'
import { QuestionStateMark } from '@/widgets/solve/ui/question-state-mark'

type SolveQuestionMarkProps = {
  syncer: DraftSyncer | undefined
  isWritten: boolean
  showsLabel?: boolean
}

/** The state of a question on the coding page: sent once its latest code went for grading. */
export function SolveQuestionMark({ syncer, isWritten, showsLabel }: SolveQuestionMarkProps) {
  const snapshot = useSyncState(syncer)
  const isSent = snapshot.submittedRevision !== null && snapshot.submittedRevision === snapshot.revision

  return <QuestionStateMark showsLabel={showsLabel} state={isSent ? 'sent' : isWritten ? 'written' : 'empty'} />
}
