import { LateStatus, SessionStatus } from '@/entities/session'
import type { Session } from '@/shared/api/sessions'

export type FinishedStatusProps = { session: Session }

export function FinishedStatus({ session }: FinishedStatusProps) {
  if (session.late && session.state === 'SUBMITTED') return <LateStatus />

  return <SessionStatus state={session.state} />
}
