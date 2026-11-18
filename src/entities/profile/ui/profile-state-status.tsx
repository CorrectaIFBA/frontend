import { PROFILE_STATE_LABEL } from '@/entities/profile/config/profile-state-label'
import type { ProfileState } from '@/shared/api/identity'
import { TONE } from '@/shared/config/state-tone'
import { StatusPill } from '@/shared/ui/status-pill'

export function ProfileStateStatus({ state }: { state: ProfileState }) {
  return <StatusPill label={PROFILE_STATE_LABEL[state]} tone={TONE[state]} />
}
