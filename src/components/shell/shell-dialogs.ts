import { useSyncExternalStore } from 'react'

/**
 * Which shell-wide dialog is open, and on which settings tab. Several places
 * open the same dialog — the account menu, the search palette, the overview —
 * so the state lives here rather than in any one of them.
 */
export type SettingsTab = 'account' | 'sessions' | 'appearance' | 'notifications'

export type ShellDialogState =
  | { dialog: 'add-account' }
  | { dialog: 'settings'; tab: SettingsTab }
  | null

let current: ShellDialogState = null
const listeners = new Set<() => void>()

function set(next: ShellDialogState) {
  current = next
  for (const listener of listeners) listener()
}

export const shellDialogs = {
  addAccount: () => set({ dialog: 'add-account' }),
  settings: (tab: SettingsTab = 'account') => set({ dialog: 'settings', tab }),
  close: () => set(null),
}

export function useShellDialog() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => current
  )
}
