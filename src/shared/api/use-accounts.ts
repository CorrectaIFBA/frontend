import { useSyncExternalStore } from 'react'
import { accountStore } from '@/shared/api/account-store'

export function useAccounts() {
  const state = useSyncExternalStore(accountStore.subscribe, accountStore.getSnapshot)
  const active = state.accounts.find((account) => account.id === state.activeId) ?? null

  return { accounts: state.accounts, active }
}
