import { LoaderCircle, Lock, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { DraftSyncer } from '@/entities/workspace/model/draft-syncer'
import { useSyncState } from '@/entities/workspace/model/use-workspaces'
import { Button } from '@/shared/ui/button'

/* Faculty may extend the deadline, so a closed period can open again: the student asks. */
export function LockedStrip({ syncer }: { syncer: DraftSyncer }) {
  const snapshot = useSyncState(syncer)
  const [pending, setPending] = useState(false)
  if (snapshot.state !== 'locked') return null

  const recheck = async () => {
    setPending(true)
    try {
      if (await syncer.recheck()) toast.success('O prazo foi estendido. Você pode continuar.')
      else toast.message('O prazo de envio continua encerrado.')
    } catch {
      toast.error('Não foi possível verificar agora.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-3 border-border border-b bg-muted/50 px-3 py-2 text-[13px]" role="status">
      <Lock className="size-4 shrink-0 text-muted-foreground" />
      <p className="min-w-0 flex-1 leading-snug">
        O prazo de envio terminou e o código ficou somente leitura.{' '}
        <span className="text-muted-foreground">Seu código continua neste navegador.</span>
      </p>
      <Button disabled={pending} onClick={recheck} size="xs" variant="outline">
        {pending ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
        Verificar de novo
      </Button>
    </div>
  )
}
