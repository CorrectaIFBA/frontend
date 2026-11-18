import { DOT_TONE, SAVE_LABEL } from '@/entities/workspace/config/save-labels'
import type { SyncSnapshot } from '@/entities/workspace/model/draft-syncer'
import { cn } from '@/shared/lib/cn'

export function SaveIndicator({ snapshot }: { snapshot: SyncSnapshot }) {
  return (
    <span
      aria-live="polite"
      className={cn(
        'inline-flex min-w-0 items-center gap-1.5 text-xs',
        snapshot.state === 'error' ? 'text-destructive' : 'text-muted-foreground'
      )}
      title={snapshot.error ?? undefined}
    >
      <span aria-hidden className={cn('size-2 shrink-0 rounded-full transition-colors', DOT_TONE[snapshot.state])} />
      <span className="truncate">{SAVE_LABEL[snapshot.state](snapshot)}</span>
    </span>
  )
}
