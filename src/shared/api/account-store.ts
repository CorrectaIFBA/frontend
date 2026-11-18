import type { ProfileType } from '@/shared/api/identity'

/**
 * The accounts this browser is signed into. Each keeps its own refresh token,
 * so switching accounts never asks for a password again.
 *
 * Only the refresh token persists. Access tokens live in memory (see
 * `token-manager.ts`) and are re-derived on load — they are never written
 * anywhere a later script could read them back.
 */
export type StoredAccount = {
  /** The institutional profile id; stable across sessions and logins. */
  id: string
  login: string
  email: string
  displayName: string
  profileType: ProfileType
  refreshToken: string
  /** Epoch milliseconds. Past it, the account is dropped on next read. */
  refreshExpiresAt: number
  lastUsedAt: number
}

type AccountState = {
  activeId: string | null
  accounts: StoredAccount[]
}

const STORAGE_KEY = 'correcta.accounts.v1'

const EMPTY: AccountState = { activeId: null, accounts: [] }

let state: AccountState = read()

const listeners = new Set<() => void>()

function read(): AccountState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY

    const parsed = JSON.parse(raw) as AccountState
    const now = Date.now()
    const accounts = (parsed.accounts ?? []).filter(
      (account) => account.refreshExpiresAt > now
    )
    const activeId = accounts.some((account) => account.id === parsed.activeId)
      ? parsed.activeId
      : (accounts[0]?.id ?? null)

    return { activeId, accounts }
  } catch {
    return EMPTY
  }
}

function commit(next: AccountState) {
  state = next

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Private mode or a full quota: the session still works for this tab.
  }

  for (const listener of listeners) listener()
}

// Another tab signed in, out, or rotated a token.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    state = read()
    for (const listener of listeners) listener()
  })
}

export const accountStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getSnapshot: () => state,

  /** Re-reads storage: the copy another tab may have just written. */
  reload() {
    state = read()
    return state
  },

  active(): StoredAccount | null {
    return state.accounts.find((account) => account.id === state.activeId) ?? null
  },

  get(id: string): StoredAccount | null {
    return state.accounts.find((account) => account.id === id) ?? null
  },

  /** Adds or replaces an account and makes it the active one. */
  upsert(account: StoredAccount) {
    commit({
      activeId: account.id,
      accounts: [
        account,
        ...state.accounts.filter((existing) => existing.id !== account.id),
      ],
    })
  },

  updateRefreshToken(id: string, refreshToken: string, refreshExpiresAt: number) {
    commit({
      ...state,
      accounts: state.accounts.map((account) =>
        account.id === id ? { ...account, refreshToken, refreshExpiresAt } : account
      ),
    })
  },

  setActive(id: string) {
    if (!state.accounts.some((account) => account.id === id)) return

    commit({
      activeId: id,
      accounts: state.accounts.map((account) =>
        account.id === id ? { ...account, lastUsedAt: Date.now() } : account
      ),
    })
  },

  remove(id: string) {
    const accounts = state.accounts.filter((account) => account.id !== id)
    const activeId =
      state.activeId === id
        ? ([...accounts].sort((first, second) => second.lastUsedAt - first.lastUsedAt)[0]?.id ?? null)
        : state.activeId

    commit({ activeId, accounts })
  },

  clear() {
    commit(EMPTY)
  },
}
