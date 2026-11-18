import type { ProfileState } from '@/shared/api/identity'

export const TONE: Record<ProfileState, string> = {
  ACTIVE: 'bg-success/10 text-success [--dot:var(--success)]',
  PENDING: 'bg-warning/12 text-warning [--dot:var(--warning)]',
  INACTIVE: 'bg-muted text-muted-foreground [--dot:var(--muted-foreground)]',
}
