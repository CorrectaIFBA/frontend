import { useCallback, useEffect, useRef, useState } from 'react'
import { clockOffset } from '@/entities/session/lib/clock-offset'
import { ApiError } from '@/shared/api/errors'
import { queryClient } from '@/shared/api/query-client'
import { fetchMySession, mySessionQueryOptions, sendHeartbeat, type Session, startSession } from '@/shared/api/sessions'

const HEARTBEAT_MS = 30_000

/* Delivery closes the session through a message queue: usually within a second or two. */
const END_POLL_MS = 1000

const END_WAIT_MS = 15_000

export type Connection =
  /** Heartbeats are getting through. */
  | { status: 'online' }
  /** They stopped; `lostAt` is the last one that got through, by this tab's clock. */
  | { status: 'offline'; lostAt: number }

export type CodingSession = {
  session: Session
  connection: Connection
  /** Server clock minus this tab's. */
  offset: number
  /** After delivering: waits until the service finishes the session; `null` if it has not yet. */
  awaitEnd: () => Promise<Session | null>
  /** Asks the service where the session stands now, as when the countdown reaches zero. */
  check: () => void
}

/*
  The coding page's side of a session. It resumes the session and beats
  every 30 seconds. Whatever the service answers is the truth: a beat may
  come back finished or expired.
*/
export function useCodingSession(assessmentId: string, initial: Session): CodingSession {
  const [session, setSession] = useState(initial)
  const [connection, setConnection] = useState<Connection>({ status: 'online' })
  const [offset, setOffset] = useState(() => clockOffset(initial.serverNow))

  const running = session.state === 'IN_PROGRESS'
  const lastOk = useRef(Date.now())

  const accept = useCallback((next: Session) => {
    setSession(next)
    setOffset(clockOffset(next.serverNow))
    lastOk.current = Date.now()
    setConnection({ status: 'online' })
  }, [])

  const fail = useCallback((error: unknown) => {
    if (!(error instanceof ApiError)) setConnection({ status: 'offline', lostAt: lastOk.current })
  }, [])

  const beat = useCallback(() => {
    sendHeartbeat(assessmentId).then(accept).catch(fail)
  }, [assessmentId, accept, fail])

  // Opening the page resumes the session. A refusal means it ended meanwhile.
  useEffect(() => {
    startSession(assessmentId)
      .then(accept)
      .catch(async (error) => {
        if (!(error instanceof ApiError && error.status === 409)) return fail(error)
        const current = await queryClient.fetchQuery({ ...mySessionQueryOptions(assessmentId), staleTime: 0 }).catch(() => null)
        if (current) accept(current)
      })
  }, [assessmentId, accept, fail])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(beat, HEARTBEAT_MS)
    const onOnline = () => beat()
    const onOffline = () => setConnection({ status: 'offline', lostAt: lastOk.current })
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [running, beat])

  const awaitEnd = useCallback(async () => {
    const deadline = Date.now() + END_WAIT_MS
    while (Date.now() < deadline) {
      const next = await fetchMySession(assessmentId).catch(() => null)
      if (next && next.state !== 'IN_PROGRESS') {
        accept(next)
        return next
      }
      await new Promise((resolve) => window.setTimeout(resolve, END_POLL_MS))
    }
    return null
  }, [assessmentId, accept])

  return { session, connection, offset, awaitEnd, check: beat }
}
