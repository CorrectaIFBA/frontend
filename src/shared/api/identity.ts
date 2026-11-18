import { rawRequest } from '@/shared/api/http'

export type ProfileType = 'STAFF' | 'FACULTY' | 'STUDENT'

export type ProfileState = 'PENDING' | 'ACTIVE' | 'INACTIVE'

export type TokenResponse = {
  tokenType: 'Bearer'
  accessToken: string
  accessTokenExpiresInSeconds: number
  refreshToken: string
  refreshTokenExpiresInSeconds: number
}

export type SelfAccountInfo = {
  account: { login: string; email: string }
  profile: { profileId: string; type: ProfileType; state: ProfileState }
  person: {
    personId: string
    firstName: string
    displayName: string
  }
}

/** Device fields are parsed from the user agent and may be missing. */
export type AccountSession = {
  sessionId: string
  lastSeenAt: string | null
  deviceType: string | null
  deviceName: string | null
  operatingSystem: string | null
  browser: string | null
  ipAddress: string | null
  countryCode: string | null
  region: string | null
  city: string | null
}

export type AccountSessions = { sessions: AccountSession[] }

export function login(body: { login: string; password: string }) {
  return rawRequest<TokenResponse>('/auth/login', { method: 'POST', body })
}

export function refreshTokens(refreshToken: string) {
  return rawRequest<TokenResponse>('/auth/refresh-token', {
    method: 'POST',
    body: { refreshToken },
  })
}

export function logout(accessToken: string) {
  return rawRequest<void>('/auth/logout', {
    method: 'POST',
    bearer: accessToken,
  })
}

/** Takes an explicit token: used right after login, before the account is stored. */
export function getSelfAccountInfo(accessToken: string, signal?: AbortSignal) {
  return rawRequest<SelfAccountInfo>('/account/me', {
    bearer: accessToken,
    signal,
  })
}

/** The activation link's token is the bearer for this one call. */
export function createAccountPassword(
  activationToken: string,
  body: { password: string; confirmPassword: string }
) {
  return rawRequest<void>('/account/create-password', {
    method: 'POST',
    body,
    bearer: activationToken,
  })
}
