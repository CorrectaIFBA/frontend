import { CloudOff, RefreshCw } from 'lucide-react'
import type { DraftSyncer } from '@/entities/workspace/model/draft-syncer'
import { useSyncState } from '@/entities/workspace/model/use-workspaces'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'

export function SaveErrorStrip({ syncer }: { syncer: DraftSyncer }) {
  const snapshot = useSyncState(syncer)
  if (snapshot.state !== 'error' && snapshot.state !== 'offline') return null
  const offline = snapshot.state === 'offline'

  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-3 border-b px-3 py-2 text-[13px]',
        offline ? 'border-warning/30 bg-warning/10' : 'border-destructive/30 bg-destructive/8'
      )}
      role="alert"
    >
      <CloudOff className={cn('size-4 shrink-0', offline ? 'text-warning' : 'text-destructive')} />
      <p className="min-w-0 flex-1 leading-snug">
        {offline
          ? 'Sem conexão. O código fica neste navegador e é salvo quando a conexão voltar.'
          : snapshot.error}
      </p>
      <Button onClick={() => void syncer.retry().catch(() => {})} size="xs" variant="outline">
        <RefreshCw /> Tentar de novo
      </Button>
    </div>
  )
}
