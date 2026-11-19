import { GitCompareArrows, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Draft, DraftSyncer } from '@/entities/workspace/model/draft-syncer'
import { useSyncState } from '@/entities/workspace/model/use-workspaces'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'

/* ---------------------------------------------------------------------------
   Strips that stop autosave until the student acts.
--------------------------------------------------------------------------- */

/*
  Another window or device saved this answer. Both choices are safe: the
  service never deletes a revision, so keeping this window's text only adds
  one on top.
*/
export function ConflictStrip({ syncer, onUseTheirs }: { syncer: DraftSyncer; onUseTheirs: (draft: Draft | null) => void }) {
  const snapshot = useSyncState(syncer)
  const [pending, setPending] = useState(false)
  if (snapshot.state !== 'conflict') return null

  const keepMine = async () => {
    setPending(true)
    try {
      await syncer.keepMine()
      toast.success('O código foi salvo como uma nova revisão.')
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-warning/30 border-b bg-warning/10 px-3 py-2 text-[13px]"
      role="alert"
    >
      <GitCompareArrows className="size-4 shrink-0 text-warning" />
      <p className="min-w-0 flex-1 leading-snug">
        Uma versão mais nova desta resposta foi salva em outra janela ou dispositivo
        {snapshot.remote?.revision ? ` (revisão ${snapshot.remote.revision})` : ''}.{' '}
        <span className="text-muted-foreground">Escolha qual código continua.</span>
      </p>
      <div className="flex shrink-0 gap-1.5">
        <Button disabled={pending} onClick={() => onUseTheirs(syncer.useTheirs())} size="xs" variant="outline">
          Usar a outra versão
        </Button>
        <Button disabled={pending} onClick={keepMine} size="xs">
          {pending ? <LoaderCircle className="animate-spin" /> : null}
          Manter a minha
        </Button>
      </div>
    </div>
  )
}
