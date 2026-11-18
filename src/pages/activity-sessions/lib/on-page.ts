import type { Session } from '@/shared/api/sessions'

/** On the page right now: a beat arrived within the last minute. */
export function onPage(session: Session) {
  if (session.state !== 'IN_PROGRESS' || !session.lastHeartbeatAt) return false
  return new Date(session.serverNow).getTime() - new Date(session.lastHeartbeatAt).getTime() < 60_000
}
