import { LoaderCircle } from 'lucide-react'
import type { DraftSyncer } from '@/entities/workspace'
import { useSyncState } from '@/entities/workspace'
import type { PreviewExecution } from '@/shared/api/evaluations'
import { cn } from '@/shared/lib/cn'

/*
  Where the request to run stands, at the foot of the test cases. Once the
  orchestrator reports a run of that revision, PreviewSummary takes over.
*/
export function RunStatus({ syncer, preview }: { syncer: DraftSyncer; preview?: PreviewExecution | null }) {
  const { run } = useSyncState(syncer)
  if (run.status === 'idle') return null
  if (run.status === 'accepted' && preview && preview.revision >= run.revision) return null
  return (
    <p
      aria-live="polite"
      className={cn(
        'flex items-center gap-2 border-border border-t px-3 py-2 text-[12px] leading-relaxed',
        run.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'
      )}
    >
      {run.status === 'running' ? <LoaderCircle className="size-3.5 shrink-0 animate-spin" /> : null}
      {run.status === 'running'
        ? run.revision
          ? `Executando a revisão ${run.revision}…`
          : 'Salvando e executando…'
        : run.status === 'accepted'
          ? `Revisão ${run.revision} enviada para execução.`
          : run.message}
    </p>
  )
}
