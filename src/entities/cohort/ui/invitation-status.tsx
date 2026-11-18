import { INVITATION_LABEL } from '@/entities/cohort/config/cohort-labels'
import { INVITATION_TONE } from '@/entities/cohort/config/cohort-tones'
import type { InvitationState } from '@/shared/api/cohorts'
import { StatusPill } from '@/shared/ui/status-pill'

export function InvitationStatus({ state }: { state: InvitationState }) {
  return <StatusPill label={INVITATION_LABEL[state]} tone={INVITATION_TONE[state]} />
}
