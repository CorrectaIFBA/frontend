import { LoaderCircle, Play, Square } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { usePreviewExecution } from '@/entities/evaluation'
import type { Draft, DraftSyncer } from '@/entities/workspace'
import { useSyncState } from '@/entities/workspace'
import { errorMessage } from '@/shared/api/errors'
import { cancelPreview, isPreviewDone } from '@/shared/api/evaluations'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

/* ---------------------------------------------------------------------------
   Running the open question, in the page header next to "Entregar":
   running is free and repeatable, delivering ends the activity.
--------------------------------------------------------------------------- */

/*
  Runs the saved revision, never the screen: the code is saved first. While a run of this workspace is queued or running, the button
  turns into "Cancelar": a new run would be ignored by the orchestrator anyway.
*/
export function RunButton({ syncer, fallback, disabled }: { syncer: DraftSyncer; fallback: Draft; disabled?: boolean }) {
  const snapshot = useSyncState(syncer)
  const { execution } = usePreviewExecution(syncer.workspaceId)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const active = execution !== null && !isPreviewDone(execution.status)
  const running = snapshot.run.status === 'running'
  const blocked =
    disabled || running || snapshot.busy || snapshot.tooLong || snapshot.state === 'conflict' || snapshot.state === 'locked'

  const run = async () => {
    await syncer.run(syncer.onScreen() ?? fallback)
    const { run: result } = syncer.snapshot()
    if (result.status === 'failed') toast.error(result.message)
  }

  if (active) {
    const pending = cancelling === execution.id
    const cancel = async () => {
      setCancelling(execution.id)
      try {
        await cancelPreview(execution.id)
      } catch (error) {
        setCancelling(null)
        toast.error(errorMessage(error))
      }
    }
    return (
      <Button
        aria-label="Cancelar a execução"
        disabled={pending}
        onClick={cancel}
        size="sm"
        title="Interrompe a execução em andamento"
        variant="ghost"
      >
        {pending ? <LoaderCircle className="animate-spin" /> : <Square />}
        <span className="hidden sm:inline">{pending ? 'Cancelando' : 'Cancelar'}</span>
      </Button>
    )
  }

  return (
    <ConfirmDialog
      action={run}
      confirmLabel="Executar"
      notice={{ tone: 'attention', message: 'O código no editor é salvo antes de executar.' }}
      title="Executar o código?"
      trigger={
        <Button
          aria-label="Executar o código"
          disabled={blocked}
          size="sm"
          title="Salva e executa o código desta questão"
          variant="ghost"
        >
          {running ? <LoaderCircle className="animate-spin" /> : <Play />}
          <span className="hidden sm:inline">{running ? 'Executando' : 'Executar'}</span>
        </Button>
      }
    />
  )
}
