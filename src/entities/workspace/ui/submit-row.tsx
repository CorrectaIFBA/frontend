import type { DraftSyncer } from '@/entities/workspace/model/draft-syncer'
import { useSyncState } from '@/entities/workspace/model/use-workspaces'
import { cn } from '@/shared/lib/cn'

/* ---------------------------------------------------------------------------
   One row of the activity's submit dialog: what will be sent for a question.
--------------------------------------------------------------------------- */

export function SubmitRow({
  syncer,
  number,
  title,
  failed,
}: {
  syncer: DraftSyncer
  number: number
  title: string
  failed: boolean
}) {
  const snapshot = useSyncState(syncer)
  const unsaved = syncer.hasUnsaved()
  const label = failed
    ? 'Não foi possível salvar'
    : snapshot.state === 'conflict'
      ? 'Versão diferente em outra janela'
      : unsaved
        ? 'Alterações não salvas'
        : snapshot.revision === 0
          ? 'Não iniciada'
          : snapshot.submittedRevision === snapshot.revision
            ? `Submetida na revisão ${snapshot.revision}`
            : `Revisão ${snapshot.revision} salva`

  return (
    <li className="flex items-baseline gap-3 py-1.5">
      <span className="w-5 shrink-0 text-right text-muted-foreground tabular-nums">{number}</span>
      <span className="min-w-0 flex-1 truncate">{title}</span>
      <span
        className={cn(
          'shrink-0 text-right',
          failed || snapshot.state === 'conflict'
            ? 'font-medium text-destructive'
            : snapshot.revision === 0 && !unsaved
              ? 'text-warning'
              : 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </li>
  )
}
