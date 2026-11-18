import { NetworkError, toApiError } from '@/shared/api/errors'

export const IDENTITY_API_URL = (
  import.meta.env.VITE_IDENTITY_API_URL || '/api/identity'
).replace(/\/$/, '')

export const COHORT_API_URL = (
  import.meta.env.VITE_COHORT_API_URL || '/api/cohort/api/v1'
).replace(/\/$/, '')

export const ASSESSMENT_API_URL = (
  import.meta.env.VITE_ASSESSMENT_API_URL || '/api/assessment/api/v1'
).replace(/\/$/, '')

export const CODE_INTEL_API_URL = (
  import.meta.env.VITE_CODE_INTEL_API_URL || '/api/code-intel/api/v1'
).replace(/\/$/, '')

export type RawRequest = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  bearer?: string
  signal?: AbortSignal
  /** The service the path belongs to; the identity service by default. */
  baseUrl?: string
  /** Lets the request finish after the page closes, for the last batch of a session's events. */
  keepalive?: boolean
}

/**
 * One HTTP call with no session logic: callers that need the signed-in
 * account go through `authedRequest`, which adds the token and the retry.
 */
export async function rawRequest<T>(
  path: string,
  { method = 'GET', body, bearer, signal, baseUrl = IDENTITY_API_URL, keepalive }: RawRequest = {}
): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' })

  // FormData sets its own multipart boundary in the Content-Type.
  const isForm = body instanceof FormData

  if (body !== undefined && !isForm) {
    headers.set('Content-Type', 'application/json')
  }

  if (bearer) {
    headers.set('Authorization', `Bearer ${bearer}`)
  }

  let response: Response

  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      // Tokens travel in the Authorization header only; never send the
      // service's own access-token cookie along.
      credentials: 'omit',
      signal,
      keepalive,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new NetworkError()
  }

  if (!response.ok) {
    throw await toApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}
