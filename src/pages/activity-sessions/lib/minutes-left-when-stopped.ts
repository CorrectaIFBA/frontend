import type { Session } from '@/shared/api/sessions'

/** What was left when the attempt stopped early, the fair amount to give back; 15 minutes otherwise. */
export function minutesLeftWhenStopped(session: Session) {
  if (!session.expiresAt || !session.finishedAt) return 15
  const left = Math.ceil((new Date(session.expiresAt).getTime() - new Date(session.finishedAt).getTime()) / 60_000)
  return left > 0 ? left : 15
}
