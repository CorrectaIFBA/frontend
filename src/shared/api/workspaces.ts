import { queryOptions } from '@tanstack/react-query'
import { accountStore } from '@/shared/api/account-store'
import { NetworkError, SessionExpiredError, toApiError } from '@/shared/api/errors'
import { tokenManager } from '@/shared/api/token-manager'

/*
  The workspace service keeps the student's code: one workspace per
  student, activity and question, holding an immutable history of drafts.
  Concurrency is optimistic: every change carries the ETag last seen in
  `If-Match`, and the service refuses it with 412 if the workspace moved on.
  See workspace-service/docs/frontend-integration-guide.md.
*/

export const WORKSPACE_API_URL = (import.meta.env.VITE_WORKSPACE_API_URL || '/api/workspace').replace(/\/$/, '')

/** The service rejects longer code with 400. */
export const MAX_CODE_LENGTH = 65_536

export type WorkspaceDraft = {
  id: string
  workspaceId: string
  revision: number
  language: string
  sourceCode: string
  createdAt: string
}

export type Workspace = {
  id: string
  entityVersion: number | null
  /** `0` while the workspace has no draft. */
  currentRevision: number
  currentDraft: WorkspaceDraft | null
  createdAt: string
}

/** A question's workspace as handed in: `currentDraft` is the submitted draft, `null` when nothing was submitted. */
export type SubmittedWorkspace = Workspace & { questionId: string }

export type SavedDraft = {
  id: string
  workspaceId: string
  revision: number
  createdAt: string
}

/** An answer, with the headers this service puts its state in. */
export type WorkspaceResponse<T> = {
  status: number
  ok: boolean
  /** Opaque: send it back exactly as received. */
  etag: string | null
  body: T
}

type WorkspaceRequest = {
  method?: 'GET' | 'PUT' | 'POST'
  ifMatch?: string
  body?: unknown
  keepalive?: boolean
  signal?: AbortSignal
}

/**
 * One call to the workspace service. Unlike the other services' helpers it
 * never throws on an HTTP status: 412, 403 and the 5xx answers each mean
 * something different to the caller, so the caller reads them. It throws
 * `NetworkError` only when no answer came back, which may hide a write that
 * did land.
 */
export async function workspaceRequest<T = unknown>(
  path: string,
  { method = 'GET', ifMatch, body, keepalive, signal }: WorkspaceRequest = {}
): Promise<WorkspaceResponse<T>> {
  const accountId = accountStore.active()?.id
  if (!accountId) throw new SessionExpiredError()

  const send = async (token: string) => {
    const headers = new Headers({ Accept: 'application/json', Authorization: `Bearer ${token}` })
    if (body !== undefined) headers.set('Content-Type', 'application/json')
    if (ifMatch !== undefined) headers.set('If-Match', ifMatch)
    try {
      return await fetch(`${WORKSPACE_API_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: 'omit',
        keepalive,
        signal,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      throw new NetworkError()
    }
  }

  const token = await tokenManager.getAccessToken(accountId)
  let response = await send(token)
  if (response.status === 401) {
    response = await send(await tokenManager.invalidate(accountId, token))
  }
  if (response.status === 401) throw new SessionExpiredError()

  const text = response.ok ? await response.text() : ''
  return {
    status: response.status,
    ok: response.ok,
    etag: response.headers.get('ETag'),
    body: (response.ok ? (text ? JSON.parse(text) : undefined) : await toApiError(response)) as T,
  }
}

export const workspacePath = (assessmentId: string, questionId: string) =>
  `/workspaces/assessment/${assessmentId}/questions/${questionId}`

export const getWorkspace = (assessmentId: string, questionId: string, signal?: AbortSignal) =>
  workspaceRequest<Workspace>(workspacePath(assessmentId, questionId), { signal })

export const putDraft = (
  workspaceId: string,
  ifMatch: string,
  draft: { sourceCode: string; language: string },
  keepalive = false
) => workspaceRequest<SavedDraft>(`/workspaces/${workspaceId}/drafts`, { method: 'PUT', ifMatch, body: draft, keepalive })

/*
  Not implemented on the service yet (guide, section 7): it answers 500, and
  the answer's shape is still undecided. The page reads only the status.
*/
export const postRun = (workspaceId: string, ifMatch: string) =>
  workspaceRequest<unknown>(`/workspaces/${workspaceId}/runs`, { method: 'POST', ifMatch })

export const postAssessmentSubmission = (assessmentId: string) =>
  workspaceRequest<void>(`/workspaces/assessment/${assessmentId}/submissions`, { method: 'POST' })

/**
 * The submitted code of every question of an activity. Students read their
 * own; faculty of the cohort pass the student's profile.
 */
export const submittedWorkspacesQueryOptions = (assessmentId: string, studentProfileId?: string) =>
  queryOptions({
    queryKey: ['workspaces', 'submitted', assessmentId, studentProfileId ?? 'mine'] as const,
    queryFn: async ({ signal }) => {
      const query = studentProfileId ? `?profileId=${encodeURIComponent(studentProfileId)}` : ''
      const response = await workspaceRequest<SubmittedWorkspace[]>(
        `/workspaces/assessment/${assessmentId}/submitted-workspaces${query}`,
        { signal }
      )
      if (!response.ok) throw response.body

      return response.body
    },
  })

/* ---------------------------------------------------------------------------
   Retries. Network failures and 5xx answers are retried with backoff; every
   other status is a real answer and goes back to the caller.
--------------------------------------------------------------------------- */

export const RETRYABLE = new Set([500, 502, 503, 504])

/** 1 s, 2 s, 4 s… capped at 30 s, with jitter. */
export const backoff = (attempt: number) => Math.min(30_000, 1000 * 2 ** attempt) * (0.5 + Math.random() / 2)

export const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/** A submit whose answer never arrived: it may or may not have landed. Resending it is safe. */
export class UnknownOutcomeError extends Error {
  constructor() {
    super('Não foi possível confirmar o envio. Tente de novo.')
    this.name = 'UnknownOutcomeError'
  }
}

/**
 * Submits are idempotent on the service (a repeat of the same revision is a
 * no-op 202), so a lost answer is retried with the exact same request.
 */
export async function submitWithRetry(request: () => Promise<WorkspaceResponse<unknown>>, attempts = 3) {
  for (let attempt = 0; ; attempt++) {
    let response: WorkspaceResponse<unknown>
    try {
      response = await request()
    } catch (error) {
      if (!(error instanceof NetworkError)) throw error
      if (attempt >= attempts) throw new UnknownOutcomeError()
      await sleep(backoff(attempt))
      continue
    }
    if (response.status === 202 || response.ok) return response
    if (RETRYABLE.has(response.status) && attempt < attempts) {
      await sleep(backoff(attempt))
      continue
    }
    throw response.body
  }
}

/** Runs `task` over `items`, at most `limit` at a time, keeping the order. */
export async function mapWithConcurrency<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await task(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}
