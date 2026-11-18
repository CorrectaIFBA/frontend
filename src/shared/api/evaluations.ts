import { accountStore } from '@/shared/api/account-store'
import type { TestcaseType } from '@/shared/api/assessments'
import { NetworkError, SessionExpiredError, toApiError } from '@/shared/api/errors'
import { tokenManager } from '@/shared/api/token-manager'

/*
  The evaluation orchestrator streams the student's runs ("previews") over a
  WebSocket, one socket per workspace:

    /api/evaluation/ws/workspaces/{workspaceId}/previews

  On connect it sends the newest run it still keeps (or `execution: null`),
  then the whole run again after every change. Frames are full snapshots, so
  a missed one costs nothing. Private test cases come with their verdict only.
*/

export const EVALUATION_API_URL = (import.meta.env.VITE_EVALUATION_API_URL || '/api/evaluation').replace(/\/$/, '')

/** Read by the gateway on the upgrade request, where browsers cannot send `Authorization`. */
const ACCESS_TOKEN_COOKIE = 'correcta-access-token'

export type PreviewStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export type TestCaseResultStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'PASSED'
  | 'WRONG_ANSWER'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'SKIPPED'

export type PreviewTestCase = {
  testCaseId: string
  position: number
  type: TestcaseType
  status: TestCaseResultStatus
  executionTimeMs: number | null
  memoryUsageBytes: number | null
  /** Public test cases only. */
  actualOutput: string | null
  /** Public test cases only. */
  errorMessage: string | null
}

export type PreviewExecution = {
  id: string
  workspaceId: string
  assessmentId: string
  questionId: string
  revision: number
  /** Grows with every step of the run; of two frames of one run, keep the higher. */
  version: number
  status: PreviewStatus
  /** `null` until the compilation ends. */
  compilationSucceeded: boolean | null
  compilationMessage: string | null
  /** Why the run failed, when `status` is `FAILED`. */
  errorMessage: string | null
  testCases: PreviewTestCase[]
  createdAt: string
  updatedAt: string
}

export type PreviewSocketMessage = { type: 'PREVIEW_EXECUTION'; execution: PreviewExecution | null }

export const isPreviewDone = (status: PreviewStatus) => status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED'

function previewSocketUrl(workspaceId: string) {
  const url = new URL(`${EVALUATION_API_URL}/ws/workspaces/${encodeURIComponent(workspaceId)}/previews`, window.location.origin)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  return url
}

function writeTokenCookie(path: string, token: string, maxAgeSeconds: number) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${token}; Path=${path}; Max-Age=${maxAgeSeconds}; SameSite=Strict${secure}`
}

/**
 * Opens the run socket of a workspace, or returns `null` if `abandoned()` turns
 * true while the token is fetched. The access token travels in a cookie scoped
 * to the socket's path, set right before the upgrade and removed once the
 * socket opens, so it never rides along on other requests.
 *
 * The cookie is not removed when a socket closes: a socket abandoned while
 * connecting would then wipe it under a newer socket's handshake on the same
 * path. Max-Age bounds it instead.
 */
export async function openPreviewSocket(workspaceId: string, abandoned: () => boolean = () => false): Promise<WebSocket | null> {
  const accountId = accountStore.active()?.id
  if (!accountId) throw new SessionExpiredError()

  const url = previewSocketUrl(workspaceId)
  const token = await tokenManager.getAccessToken(accountId)
  if (abandoned()) return null

  writeTokenCookie(url.pathname, token, 30)
  const socket = new WebSocket(url)
  socket.addEventListener('open', () => writeTokenCookie(url.pathname, '', 0), { once: true })
  return socket
}

/**
 * Asks the orchestrator to stop a run. It answers at once (202); the run
 * itself turns CANCELLED on the socket. A run that already ended is left as is.
 */
export async function cancelPreview(executionId: string): Promise<void> {
  const accountId = accountStore.active()?.id
  if (!accountId) throw new SessionExpiredError()

  const send = async (token: string) => {
    try {
      return await fetch(`${EVALUATION_API_URL}/previews/${encodeURIComponent(executionId)}/cancel`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'omit',
      })
    } catch {
      throw new NetworkError()
    }
  }

  const token = await tokenManager.getAccessToken(accountId)
  let response = await send(token)
  if (response.status === 401) response = await send(await tokenManager.invalidate(accountId, token))
  if (response.status === 401) throw new SessionExpiredError()
  if (!response.ok) throw await toApiError(response)
}
