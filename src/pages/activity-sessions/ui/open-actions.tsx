import { History, Square, TimerReset } from 'lucide-react'
import { IconAction } from '@/pages/activity-sessions/ui/icon-action'
import { TimeDialog } from '@/pages/activity-sessions/ui/time-dialog'
import { WorkspaceAction } from '@/pages/activity-sessions/ui/workspace-action'
import type { Assessment } from '@/shared/api/assessments'
import { closeSession, extendSession, type Session } from '@/shared/api/sessions'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

export type OpenActionsProps = {
  session: Session
  name: string
  assessment: Assessment
  canAct: boolean
  onInspect: () => void
}

export function OpenActions({ session, name, assessment, canAct, onInspect }: OpenActionsProps) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {canAct && session.expiresAt ? (
        <TimeDialog
          action={(change) => extendSession(assessment.id, session.id, change)}
          confirmLabel="Estender"
          defaultMinutes={10}
          description={`Os minutos se somam ao prazo de ${name}.`}
          successMessage="Tempo estendido."
          title="Estender o tempo?"
          trigger={<IconAction icon={<TimerReset />} label="Estender o tempo" />}
        />
      ) : null}
      {canAct ? (
        <ConfirmDialog
          action={() => closeSession(assessment.id, session.id)}
          confirmLabel="Encerrar"
          description={`A tentativa de ${name} termina agora como entregue. Vale o que já foi enviado.`}
          destructive
          successMessage="Tentativa encerrada."
          title="Encerrar a tentativa?"
          trigger={<IconAction icon={<Square />} label="Encerrar" tone="destructive" />}
        />
      ) : null}
      <IconAction icon={<History />} label="Ver registro" onClick={onInspect} />
      <WorkspaceAction />
    </div>
  )
}
