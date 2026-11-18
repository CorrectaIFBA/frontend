import { useNow } from '@/entities/session'
import { useSolve } from '@/widgets/solve/model/solve-context'

/** Milliseconds left by the server's clock, ticking; `null` without a deadline. */
export function useClock() {
  const { coding } = useSolve()
  const { session, offset } = coding
  const running = session.state === 'IN_PROGRESS' && Boolean(session.expiresAt)
  const now = useNow(1000, running)
  if (!running || !session.expiresAt) return null
  return Math.max(0, new Date(session.expiresAt).getTime() - (now + offset))
}
