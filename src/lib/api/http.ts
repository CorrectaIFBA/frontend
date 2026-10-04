import { NetworkError, toApiError } from '@/lib/api/errors'

export const IDENTITY_API_URL = (
  import.meta.env.VITE_IDENTITY_API_URL || '/api/identity'
).replace(/\/$/, '')

export type RawRequest = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  bearer?: string
  signal?: AbortSignal
}

/**
 * One HTTP call with no session logic: callers that need the signed-in
 * account go through `authedRequest`, which adds the token and the retry.
 */
export async function rawRequest<T>(
  path: string,
  { method = 'GET', body, bearer, signal }: RawRequest = {}
): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' })

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (bearer) {
    headers.set('Authorization', `Bearer ${bearer}`)
  }

  let response: Response

  try {
    response = await fetch(`${IDENTITY_API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      // Tokens travel in the Authorization header only; never send the
      // service's own access-token cookie along.
      credentials: 'omit',
      signal,
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
