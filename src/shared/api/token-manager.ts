import { accountStore } from '@/shared/api/account-store'
import { ApiError, SessionExpiredError } from '@/shared/api/errors'
import { refreshTokens, type TokenResponse } from '@/shared/api/identity'

/*
  Access tokens: short-lived, kept until they expire.
  --------------------------------------------------
  The current access token of each account is persisted next to its refresh
  token, so a page reload or a new tab reuses it instead of spending a
  refresh. (It adds no exposure: the refresh token already lives there.)

  The identity service rotates refresh tokens on every use and rejects a
  token that was already spent. So the one rule this module exists to keep is:
  a given refresh token is redeemed at most once, across every tab.

    - Within a tab, concurrent callers share a single in-flight refresh.
    - Across tabs, the refresh runs under a Web Lock. A tab that waited on the
      lock re-reads storage first: if the token changed underneath it, another
      tab already rotated and broadcast the new access token, so it adopts
      that instead of spending the new refresh token a second time.
    - Refreshes are proactive: scheduled a minute before expiry while the tab
      is visible, so requests almost never meet an expired token. A 401 still
      triggers one forced refresh and a single retry, as a backstop.
*/

type AccessToken = { token: string; expiresAt: number; lifetimeMs: number }

/**
 * Renew this long before the access token actually expires — capped at a
 * fifth of its lifetime, so a short-lived token is not renewed in a loop.
 */
const EXPIRY_SKEW_MS = 60_000

/** How long a tab that lost the race waits for the winner's broadcast. */
const BROADCAST_GRACE_MS = 250

const ACCESS_STORAGE_KEY = 'correcta.access.v1'

/** A Map persisted to localStorage; expired entries are dropped on read. */
const accessTokens = (() => {
  const entries = new Map<string, AccessToken>()

  function hydrate() {
    entries.clear()
    try {
      const raw = localStorage.getItem(ACCESS_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Record<string, AccessToken>) : {}
      for (const [accountId, entry] of Object.entries(parsed)) {
        if (entry.expiresAt > Date.now()) entries.set(accountId, entry)
      }
    } catch {
      // Unreadable storage: tokens are simply refreshed when needed.
    }
  }

  function persist() {
    try {
      localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)))
    } catch {
      // Private mode or a full quota: memory still holds the token.
    }
  }

  hydrate()

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === ACCESS_STORAGE_KEY) hydrate()
    })
  }

  return {
    get: (accountId: string) => entries.get(accountId),
    set(accountId: string, entry: AccessToken) {
      entries.set(accountId, entry)
      persist()
    },
    delete(accountId: string) {
      if (entries.delete(accountId)) persist()
    },
  }
})()

const inFlight = new Map<string, Promise<string>>()

const expiredListeners = new Set<(accountId: string) => void>()

let refreshTimer: ReturnType<typeof setTimeout> | undefined

type Message =
  | {
      type: 'rotated'
      accountId: string
      token: string
      expiresAt: number
      lifetimeMs: number
    }
  | { type: 'signed-out'; accountId: string }

const channel =
  typeof BroadcastChannel === 'undefined'
    ? null
    : new BroadcastChannel('correcta.auth')

channel?.addEventListener('message', (event: MessageEvent<Message>) => {
  const message = event.data

  if (message.type === 'rotated') {
    accessTokens.set(message.accountId, {
      token: message.token,
      expiresAt: message.expiresAt,
      lifetimeMs: message.lifetimeMs,
    })
    accountStore.reload()
    if (message.accountId === accountStore.active()?.id) scheduleRefresh()
  }

  if (message.type === 'signed-out') {
    accessTokens.delete(message.accountId)
    accountStore.reload()
  }
})

function renewAt(entry: AccessToken) {
  return entry.expiresAt - Math.min(EXPIRY_SKEW_MS, entry.lifetimeMs / 5)
}

function isFresh(entry: AccessToken | undefined): entry is AccessToken {
  return Boolean(entry && renewAt(entry) > Date.now())
}

function withLock<T>(name: string, task: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request(name, task)
  }
  return task()
}

function waitForBroadcast(accountId: string): Promise<AccessToken | undefined> {
  return new Promise((resolve) => {
    if (!channel) return resolve(undefined)

    const timeout = setTimeout(() => {
      channel.removeEventListener('message', onMessage)
      resolve(accessTokens.get(accountId))
    }, BROADCAST_GRACE_MS)

    function onMessage(event: MessageEvent<Message>) {
      if (event.data.type === 'rotated' && event.data.accountId === accountId) {
        clearTimeout(timeout)
        channel?.removeEventListener('message', onMessage)
        resolve(accessTokens.get(accountId))
      }
    }

    channel.addEventListener('message', onMessage)
  })
}

async function performRefresh(accountId: string): Promise<string> {
  const seenRefreshToken = accountStore.get(accountId)?.refreshToken

  return withLock(`correcta.refresh.${accountId}`, async () => {
    accountStore.reload()
    const account = accountStore.get(accountId)
    if (!account) throw new SessionExpiredError()

    // Another tab held the lock and rotated while this one waited.
    if (seenRefreshToken && account.refreshToken !== seenRefreshToken) {
      const adopted = isFresh(accessTokens.get(accountId))
        ? accessTokens.get(accountId)
        : await waitForBroadcast(accountId)
      if (isFresh(adopted)) return adopted.token
    }

    let tokens: TokenResponse
    try {
      tokens = await refreshTokens(account.refreshToken)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        expire(accountId)
        throw new SessionExpiredError()
      }
      // Offline or a server hiccup: keep the session, let the caller retry.
      throw error
    }

    storeTokens(accountId, tokens)
    return tokens.accessToken
  })
}

function expire(accountId: string) {
  accessTokens.delete(accountId)
  accountStore.remove(accountId)
  channel?.postMessage({ type: 'signed-out', accountId } satisfies Message)
  for (const listener of expiredListeners) listener(accountId)
}

/** Persists a fresh pair (login or refresh) and tells the other tabs. */
export function storeTokens(accountId: string, tokens: TokenResponse) {
  const now = Date.now()
  const lifetimeMs = tokens.accessTokenExpiresInSeconds * 1000
  const expiresAt = now + lifetimeMs

  accessTokens.set(accountId, { token: tokens.accessToken, expiresAt, lifetimeMs })

  if (accountStore.get(accountId)) {
    accountStore.updateRefreshToken(
      accountId,
      tokens.refreshToken,
      now + tokens.refreshTokenExpiresInSeconds * 1000
    )
  }

  channel?.postMessage({
    type: 'rotated',
    accountId,
    token: tokens.accessToken,
    expiresAt,
    lifetimeMs,
  } satisfies Message)

  if (accountId === accountStore.active()?.id) scheduleRefresh()
}

export const tokenManager = {
  /** A valid access token for the account, refreshing only when needed. */
  getAccessToken(accountId: string): Promise<string> {
    const cached = accessTokens.get(accountId)
    if (isFresh(cached)) return Promise.resolve(cached.token)
    return this.refresh(accountId)
  },

  /** The token held right now, if any, without touching the network. */
  peek(accountId: string): string | undefined {
    const cached = accessTokens.get(accountId)
    return cached && cached.expiresAt > Date.now() ? cached.token : undefined
  },

  refresh(accountId: string): Promise<string> {
    const pending = inFlight.get(accountId)
    if (pending) return pending

    const request = performRefresh(accountId).finally(() => {
      inFlight.delete(accountId)
    })
    inFlight.set(accountId, request)
    return request
  },

  /**
   * After a 401: drop the token that failed and refresh, unless a concurrent
   * request already replaced it — then that replacement is used as is.
   */
  invalidate(accountId: string, rejectedToken: string): Promise<string> {
    if (accessTokens.get(accountId)?.token === rejectedToken) {
      accessTokens.delete(accountId)
    }
    return this.getAccessToken(accountId)
  },

  /** Forgets an account locally, e.g. after logout. */
  forget(accountId: string) {
    accessTokens.delete(accountId)
    channel?.postMessage({ type: 'signed-out', accountId } satisfies Message)
  },

  onExpired(listener: (accountId: string) => void) {
    expiredListeners.add(listener)
    return () => expiredListeners.delete(listener)
  },
}

/** Keeps the active account's token ahead of its expiry while the tab is in use. */
export function scheduleRefresh() {
  clearTimeout(refreshTimer)

  const accountId = accountStore.active()?.id
  const entry = accountId ? accessTokens.get(accountId) : undefined
  if (!(accountId && entry)) return

  const delay = Math.max(renewAt(entry) - Date.now(), 1_000)

  refreshTimer = setTimeout(() => {
    // A hidden tab waits: it renews when it is looked at again, or another
    // visible tab renews and broadcasts.
    if (document.visibilityState === 'hidden') return
    tokenManager.refresh(accountId).catch(() => undefined)
  }, delay)
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return

    const accountId = accountStore.active()?.id
    if (!accountId) return

    if (isFresh(accessTokens.get(accountId))) {
      scheduleRefresh()
    } else {
      tokenManager.refresh(accountId).catch(() => undefined)
    }
  })
}

// A token restored from storage still needs its renewal scheduled.
scheduleRefresh()
