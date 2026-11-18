import { useCodingSession } from '@/entities/session'
import { useWorkspaces } from '@/entities/workspace'
import { Ready } from '@/pages/solve/ui/ready'
import { SessionEndDialogStandalone } from '@/pages/solve/ui/session-end-dialog-standalone'
import type { Assessment, AssessmentQuestion } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import type { Session } from '@/shared/api/sessions'
import { Button } from '@/shared/ui/button'
import { PanelNote } from '@/shared/ui/panel-note'
import { SolveScreen, SolveSkeleton } from '@/widgets/solve'

export function Workspace({
  assessment,
  questions,
  session,
}: {
  assessment: Assessment
  questions: AssessmentQuestion[]
  session: Session
}) {
  const coding = useCodingSession(assessment.id, session)
  const workspaces = useWorkspaces(assessment.id, session.id, questions)

  if (workspaces.status === 'ready') {
    return (
      <Ready
        assessment={assessment}
        coding={coding}
        flushAll={workspaces.flushAll}
        questions={questions}
        syncers={workspaces.syncers}
      />
    )
  }
  if (workspaces.status === 'loading') return <SolveSkeleton />

  const notice =
    workspaces.status === 'elsewhere'
      ? {
          text: 'Esta atividade está aberta em outra aba. Feche a outra aba para continuar aqui.',
          action: null,
        }
      : workspaces.status === 'closed'
        ? {
            text: 'O prazo de envio terminou. Se um docente estender o prazo, verifique de novo.',
            action: { label: 'Verificar de novo', run: workspaces.recheck },
          }
        : { text: errorMessage(workspaces.error), action: { label: 'Tentar de novo', run: workspaces.retry } }

  return (
    <SolveScreen>
      <div className="m-auto flex w-full max-w-md flex-col items-start gap-3 p-4">
        <PanelNote tone={workspaces.status === 'error' ? 'muted' : 'warning'}>{notice.text}</PanelNote>
        {notice.action ? (
          <Button onClick={notice.action.run} size="sm" variant="outline">
            {notice.action.label}
          </Button>
        ) : null}
      </div>
      <SessionEndDialogStandalone assessment={assessment} coding={coding} questions={questions} />
    </SolveScreen>
  )
}
