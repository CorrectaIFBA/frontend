import { queryOptions } from '@tanstack/react-query'
import { ApiError, SessionExpiredError } from '@/lib/api/errors'
import { type RawRequest, rawRequest } from '@/lib/api/http'
import * as identity from '@/lib/api/identity'
import { accountStore } from '@/lib/auth/account-store'
import { storeTokens, tokenManager } from '@/lib/auth/token-manager'
import { queryClient } from '@/lib/query-client'

/**
 * A request made as the active account. Adds the bearer token, and on a 401
 * renews it once and retries; a second 401 means the session is gone.
 */
export async function authedRequest<T>(
  path: string,
  options: Omit<RawRequest, 'bearer'> = {}
): Promise<T> {
  const accountId = accountStore.active()?.id
  if (!accountId) throw new SessionExpiredError()

  const token = await tokenManager.getAccessToken(accountId)

  try {
    return await rawRequest<T>(path, { ...options, bearer: token })
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 401)) throw error

    const renewed = await tokenManager.invalidate(accountId, token)
    return rawRequest<T>(path, { ...options, bearer: renewed })
  }
}

export const meQueryOptions = (accountId: string) =>
  queryOptions({
    queryKey: ['accounts', accountId, 'me'],
    queryFn: ({ signal }) =>
      authedRequest<identity.SelfAccountInfo>('/account/me', { signal }),
    staleTime: 5 * 60_000,
    retry: (failureCount, error) =>
      !(error instanceof SessionExpiredError) && failureCount < 1,
  })

/**
 * Signs in and stores the account beside any already signed in. The profile
 * id from `/account/me` keys the account, so signing in twice as the same
 * person replaces the old entry instead of duplicating it.
 */
export async function signIn(credentials: { login: string; password: string }) {
  const tokens = await identity.login(credentials)
  const me = await identity.getSelfAccountInfo(tokens.accessToken)
  const now = Date.now()

  accountStore.upsert({
    id: me.profile.profileId,
    login: me.account.login,
    email: me.account.email,
    displayName: me.person.displayName,
    profileType: me.profile.type,
    refreshToken: tokens.refreshToken,
    refreshExpiresAt: now + tokens.refreshTokenExpiresInSeconds * 1000,
    lastUsedAt: now,
  })
  storeTokens(me.profile.profileId, tokens)

  // Everything cached so far belonged to whoever was active before.
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== 'accounts',
  })
  queryClient.setQueryData(meQueryOptions(me.profile.profileId).queryKey, me)

  return me
}

export function switchAccount(accountId: string) {
  accountStore.setActive(accountId)
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== 'accounts',
  })
}

/** Ends the server session (best effort) and forgets the account here. */
export async function signOut(accountId: string) {
  // An account that is not active may hold no access token in memory; renew
  // it so the server-side session is revoked too, not just left to expire.
  const token =
    tokenManager.peek(accountId) ??
    (await tokenManager.getAccessToken(accountId).catch(() => undefined))

  if (token) {
    await identity.logout(token).catch(() => undefined)
  }

  tokenManager.forget(accountId)
  accountStore.remove(accountId)
  queryClient.removeQueries({ queryKey: ['accounts', accountId] })
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== 'accounts',
  })
}

export async function signOutEverywhere() {
  const { accounts } = accountStore.getSnapshot()
  await Promise.all(accounts.map((account) => signOut(account.id)))
  accountStore.clear()
}
