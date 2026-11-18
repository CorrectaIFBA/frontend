import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { type Assessment, assessmentKeys, assessmentRequest } from '@/shared/api/assessments'
import { type Paged, type Pagination, toQuery } from '@/shared/api/directory'
import { queryClient } from '@/shared/api/query-client'

/*
  A student's attempt at an activity. It starts once and runs until
  submitted or until its deadline. The service's clock decides all of it:
  every answer carries `serverNow`, and the page only counts down from there.
*/

export type SessionState = 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED'

export type SessionEventType =
  | 'STARTED'
  | 'RESUMED'
  | 'SUBMITTED'
  | 'EXPIRED'
  | 'CLOSED_BY_ARCHIVE'
  | 'CLOSED_BY_FACULTY'
  | 'REOPENED'
  | 'EXTENDED'

/** The caller's session as embedded in each activity of a listing. */
export type SessionSummary = {
  id: string
  state: SessionState
  startedAt: string
  /** `null` when only submitting ends it. */
  expiresAt: string | null
  finishedAt: string | null
  late: boolean
  serverNow: string
}

export type Session = SessionSummary & {
  assessmentId: string
  assessmentTitle: string
  assessmentSlug: string
  cohortId: string | null
  studentProfileId: string
  lastHeartbeatAt: string | null
  /** Seconds the coding page was open. */
  openSeconds: number
  /** Read live, so faculty may release the scoring later. */
  rules: {
    canViewDefinitiveTestcaseScoringAfterSubmission: boolean
  }
}

export type SessionEvent = {
  id: string
  type: SessionEventType
  occurredAt: string
  receivedAt: string
  actorProfileId: string | null
  detail: string | null
}

/** Which part of the roster: finished sessions, or students still working or yet to start. */
export type RosterGroup = 'FINISHED' | 'OPEN'

/** The fields the roster accepts in `sortBy`. */
export const ROSTER_SORT_FIELDS = ['name', 'startedAt', 'finishedAt', 'elapsedSeconds', 'openSeconds', 'attempt'] as const

export type RosterSortField = (typeof ROSTER_SORT_FIELDS)[number]

/** One student of the cohort against an activity, with the session once it exists. */
export type RosterEntry = {
  studentProfileId: string
  displayName: string | null
  /** `false` when the student left the cohort after starting. */
  currentMember: boolean
  /** 1 for the first attempt, plus one per reopening; 0 before starting. */
  attempt: number
  /** From the start to the end, or to now while running; `null` before starting. */
  elapsedSeconds: number | null
  session: Session | null
}

export type SessionTimeChange = { extraMinutes: number; reason?: string }

export const sessionKeys = {
  all: ['sessions'] as const,
  mine: (assessmentId: string) => ['sessions', 'mine', assessmentId] as const,
  ofAssessment: (assessmentId: string) => ['sessions', 'of', assessmentId] as const,
}

const sessionsPath = (assessmentId: string) => `/assessments/${assessmentId}/sessions`

/** `null` before the student starts. */
export const mySessionQueryOptions = (assessmentId: string) =>
  queryOptions({
    queryKey: sessionKeys.mine(assessmentId),
    queryFn: async ({ signal }) => {
      try {
        return await assessmentRequest<Session>(`${sessionsPath(assessmentId)}/me`, { signal })
      } catch (error) {
        if ((error as { status?: number }).status === 404) return null
        throw error
      }
    },
  })

export const mySessionsQueryOptions = (state: SessionState | undefined, pagination: Pagination) =>
  queryOptions({
    queryKey: [...sessionKeys.all, 'mine', 'list', state, pagination],
    queryFn: ({ signal }) =>
      assessmentRequest<Paged<Session>>(`/assessment-sessions/me${toQuery({ state, ...pagination })}`, { signal }),
    placeholderData: keepPreviousData,
  })

export const sessionRosterQueryOptions = (
  assessmentId: string,
  filter: { group: RosterGroup; search?: string },
  pagination: Pagination
) =>
  queryOptions({
    queryKey: [...sessionKeys.ofAssessment(assessmentId), 'roster', filter, pagination],
    queryFn: ({ signal }) =>
      assessmentRequest<Paged<RosterEntry>>(`${sessionsPath(assessmentId)}/roster${toQuery({ ...filter, ...pagination })}`, {
        signal,
      }),
    placeholderData: keepPreviousData,
  })

export const sessionCountsQueryOptions = (assessmentId: string) =>
  queryOptions({
    queryKey: [...sessionKeys.ofAssessment(assessmentId), 'summary'],
    queryFn: ({ signal }) =>
      assessmentRequest<Record<SessionState, number>>(`${sessionsPath(assessmentId)}/summary`, { signal }),
  })

/** One student's session, for faculty. */
export const sessionQueryOptions = (assessmentId: string, sessionId: string) =>
  queryOptions({
    queryKey: [...sessionKeys.ofAssessment(assessmentId), sessionId],
    queryFn: ({ signal }) => assessmentRequest<Session>(`${sessionsPath(assessmentId)}/${sessionId}`, { signal }),
  })

export const sessionEventsQueryOptions = (assessmentId: string, sessionId: string) =>
  queryOptions({
    queryKey: [...sessionKeys.ofAssessment(assessmentId), sessionId, 'events'],
    queryFn: ({ signal }) =>
      assessmentRequest<SessionEvent[]>(`${sessionsPath(assessmentId)}/${sessionId}/events`, { signal }),
  })

/*
  The activity page and the coding page each redirect to the other from a
  different query (the activity's embedded `mySession`, and `/sessions/me`).
  Both must say the same thing at once, or each sends the student back to
  the other, and every hop cancels the refetch that would settle it.
*/
function patchEmbeddedSession(assessmentId: string, session: Session) {
  const summary: SessionSummary = {
    id: session.id,
    state: session.state,
    startedAt: session.startedAt,
    expiresAt: session.expiresAt,
    finishedAt: session.finishedAt,
    late: session.late,
    serverNow: session.serverNow,
  }
  const patch = (assessment: Assessment) =>
    assessment.id === assessmentId ? { ...assessment, mySession: summary } : assessment

  queryClient.setQueriesData({ queryKey: assessmentKeys.all }, (data: unknown) => {
    if (!data || typeof data !== 'object') return data
    if ('content' in data && Array.isArray((data as { content: unknown }).content)) {
      const page = data as { content: Assessment[] }
      return { ...page, content: page.content.map(patch) }
    }
    if ('id' in data && 'mySession' in data) return patch(data as Assessment)
    return data
  })
}

/** The student's own session changed: its query and every activity listing showing it. */
async function mineChanged(assessmentId: string, session: Session) {
  queryClient.setQueryData(sessionKeys.mine(assessmentId), session)
  patchEmbeddedSession(assessmentId, session)
  await queryClient.invalidateQueries({ queryKey: [...assessmentKeys.all] })
  await queryClient.invalidateQueries({ queryKey: [...sessionKeys.all, 'mine', 'list'] })
  return session
}

export const startSession = async (assessmentId: string) =>
  mineChanged(
    assessmentId,
    await assessmentRequest<Session>(`${sessionsPath(assessmentId)}/me/start`, { method: 'POST' })
  )

/** Not cached on purpose: the coding page owns the session while it is open. */
export const sendHeartbeat = (assessmentId: string) =>
  assessmentRequest<Session>(`${sessionsPath(assessmentId)}/me/heartbeat`, { method: 'POST' })

/*
  Students no longer finish a session themselves: delivering goes through the
  workspace service, which submits every answer and then tells this service
  (asynchronously) to close the session. The page polls until it has.
*/
export const fetchMySession = async (assessmentId: string) =>
  mineChanged(assessmentId, await assessmentRequest<Session>(`${sessionsPath(assessmentId)}/me`))

async function facultyChanged(assessmentId: string, request: Promise<Session>) {
  try {
    return await request
  } finally {
    await queryClient.invalidateQueries({ queryKey: sessionKeys.ofAssessment(assessmentId) })
  }
}

export const reopenSession = (assessmentId: string, sessionId: string, body: SessionTimeChange) =>
  facultyChanged(
    assessmentId,
    assessmentRequest<Session>(`${sessionsPath(assessmentId)}/${sessionId}/reopen`, { method: 'POST', body })
  )

export const extendSession = (assessmentId: string, sessionId: string, body: SessionTimeChange) =>
  facultyChanged(
    assessmentId,
    assessmentRequest<Session>(`${sessionsPath(assessmentId)}/${sessionId}/extend`, { method: 'POST', body })
  )

export const closeSession = (assessmentId: string, sessionId: string) =>
  facultyChanged(
    assessmentId,
    assessmentRequest<Session>(`${sessionsPath(assessmentId)}/${sessionId}/close`, { method: 'POST' })
  )
