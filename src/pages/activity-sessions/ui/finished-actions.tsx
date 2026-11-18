import { ClipboardPen, History, RotateCcw } from 'lucide-react'
import { minutesLeftWhenStopped } from '@/pages/activity-sessions/lib/minutes-left-when-stopped'
import { IconAction } from '@/pages/activity-sessions/ui/icon-action'
import { TimeDialog } from '@/pages/activity-sessions/ui/time-dialog'
import { WorkspaceAction } from '@/pages/activity-sessions/ui/workspace-action'
import type { Assessment } from '@/shared/api/assessments'
import { reopenSession, type Session } from '@/shared/api/sessions'

export type FinishedActionsProps = {
  session: Session
  name: string
  assessment: Assessment
  canAct: boolean
  onInspect: () => void
  onOpen: () => void
  onGrade: () => void
}

export function FinishedActions({ session, name, assessment, canAct, onInspect, onOpen, onGrade }: FinishedActionsProps) {
  const canReopen = canAct && assessment.state === 'PUBLISHED'

  return (
    // The row opens the submission; clicks and keys on its actions, dialogs included, stay here.
    <div
      className="flex items-center justify-end gap-0.5"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {canReopen ? (
        <TimeDialog
          action={(change) => reopenSession(assessment.id, session.id, change)}
          confirmLabel="Reabrir"
          defaultMinutes={minutesLeftWhenStopped(session)}
          description={`${name} volta para a atividade com estes minutos, contados a partir de agora. Conta como uma nova tentativa.`}
          successMessage="Tentativa reaberta."
          title="Reabrir a tentativa?"
          trigger={<IconAction icon={<RotateCcw />} label="Reabrir" />}
        />
      ) : (
        <IconAction
          disabledHint={canAct ? 'Publique a atividade para reabrir' : 'A turma não está ativa'}
          icon={<RotateCcw />}
          label="Reabrir"
        />
      )}
      <IconAction icon={<ClipboardPen />} label="Atribuir notas" onClick={onGrade} />
      <IconAction icon={<History />} label="Ver registro" onClick={onInspect} />
      <WorkspaceAction onOpen={onOpen} />
    </div>
  )
}
