import { useEffect, useState } from 'react'
import { clockOffset } from '@/entities/session/lib/clock-offset'
import { useNow } from '@/entities/session/model/use-now'
import type { SessionSummary } from '@/shared/api/sessions'

/** Milliseconds left in the session by the server's clock; `null` without a deadline. */
export function useRemaining(session: Pick<SessionSummary, 'expiresAt' | 'serverNow' | 'state'> | null | undefined) {
  const running = session?.state === 'IN_PROGRESS' && Boolean(session.expiresAt)
  const now = useNow(1000, running)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (session?.serverNow) setOffset(clockOffset(session.serverNow))
  }, [session?.serverNow])

  if (!running || !session?.expiresAt) return null
  return Math.max(0, new Date(session.expiresAt).getTime() - (now + offset))
}
