import type { SessionState } from '@/shared/api/sessions'

export const SESSION_STATE_LABEL: Record<SessionState, string> = {
  IN_PROGRESS: 'Em andamento',
  SUBMITTED: 'Entregue',
  EXPIRED: 'Tempo esgotado',
}

export const SESSION_TONE: Record<SessionState, string> = {
  IN_PROGRESS: 'bg-(--cohort-ink)/12 text-(--cohort-ink) [--dot:var(--cohort-ink)]',
  SUBMITTED: 'bg-success/10 text-success [--dot:var(--success)]',
  EXPIRED: 'bg-muted text-muted-foreground [--dot:var(--muted-foreground)]',
}
