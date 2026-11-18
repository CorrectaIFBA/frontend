/**
 * Every failed call to a Correcta service surfaces as an `ApiError`. The
 * identity service answers with `{ message }`, and validation failures add
 * `errors`, a map from request field to its message.
 */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {}
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

/** The stored session can no longer be renewed; the person must sign in again. */
export class SessionExpiredError extends Error {
  constructor(message = 'Sua sessão expirou. Entre novamente.') {
    super(message)
    this.name = 'SessionExpiredError'
  }
}

/** The request never got an answer: offline, DNS, CORS, a dropped connection. */
export class NetworkError extends Error {
  constructor() {
    super('Não foi possível falar com o servidor. Verifique sua conexão.')
    this.name = 'NetworkError'
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return 'O servidor encontrou um problema. Tente novamente em instantes.'
    }
    return error.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Algo deu errado. Tente novamente.'
}

export async function toApiError(response: Response): Promise<ApiError> {
  let message = `O servidor respondeu ${response.status}.`
  let fieldErrors: Record<string, string> = {}

  try {
    const body = (await response.json()) as {
      message?: unknown
      errors?: unknown
    }

    if (typeof body.message === 'string' && body.message) {
      message = body.message
    }

    if (body.errors && typeof body.errors === 'object') {
      fieldErrors = body.errors as Record<string, string>
    }
  } catch {
    // Not every error carries a JSON body (proxies, gateways).
  }

  return new ApiError(response.status, message, fieldErrors)
}
