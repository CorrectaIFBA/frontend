import { SESSION_STATE_LABEL, SESSION_TONE } from '@/entities/session/config/session-state'
import type { SessionState } from '@/shared/api/sessions'
import { StatusPill } from '@/shared/ui/status-pill'

export function SessionStatus({ state }: { state: SessionState }) {
  return <StatusPill label={SESSION_STATE_LABEL[state]} tone={SESSION_TONE[state]} />
}
