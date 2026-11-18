import { SessionStatus } from '@/entities/session'
import { onPage } from '@/pages/activity-sessions/lib/on-page'
import type { Session } from '@/shared/api/sessions'
import { cn } from '@/shared/lib/cn'
import { StatusPill } from '@/shared/ui/status-pill'

export type OpenStatusProps = { session: Session | null }

/** Working or not started; while working, whether the coding page is open right now. */
export function OpenStatus({ session }: OpenStatusProps) {
  if (!session) {
    return <StatusPill label="Não iniciou" tone="bg-muted text-muted-foreground [--dot:var(--border-strong)]" />
  }

  const present = onPage(session)

  return (
    <span className="flex flex-col items-start gap-1">
      <SessionStatus state={session.state} />
      <span className="inline-flex items-center gap-1.5 pl-1.5 text-[11px] text-muted-foreground">
        <span className={cn('size-1.5 rounded-full', present ? 'bg-success' : 'bg-muted-foreground/40')} />
        {present ? 'Na página agora' : 'Fora da página'}
      </span>
    </span>
  )
}
