import type { CohortState, InvitationState } from '@/shared/api/cohorts'

export const STATE_TONE: Record<CohortState, string> = {
  ACTIVE: 'bg-success/10 text-success [--dot:var(--success)]',
  DRAFT: 'bg-warning/12 text-warning [--dot:var(--warning)]',
  ARCHIVED: 'bg-muted text-muted-foreground [--dot:var(--muted-foreground)]',
}

export const INVITATION_TONE: Record<InvitationState, string> = {
  PENDING: STATE_TONE.DRAFT,
  ACCEPTED: STATE_TONE.ACTIVE,
  REJECTED: STATE_TONE.ARCHIVED,
  REVOKED: STATE_TONE.ARCHIVED,
  EXPIRED: STATE_TONE.ARCHIVED,
}
