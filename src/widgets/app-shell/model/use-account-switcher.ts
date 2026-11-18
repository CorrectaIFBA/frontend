import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { signOut, signOutEverywhere, switchAccount } from '@/shared/api/session'
import { useAccounts } from '@/shared/api/use-accounts'

/* The accounts signed in on this browser, and switching or signing out of them. */
export function useAccountSwitcher() {
  const navigate = useNavigate()
  const { accounts, active } = useAccounts()
  const [isBusy, setBusy] = useState(false)
  const others = accounts.filter((account) => account.id !== active?.id)

  function handleSwitch(accountId: string, name: string) {
    switchAccount(accountId)
    navigate({ to: '/' })
    toast(`Agora você está como ${name.split(' ')[0]}.`)
  }

  async function handleSignOut(everywhere: boolean) {
    if (!active) return

    setBusy(true)

    try {
      if (everywhere) {
        await signOutEverywhere()
      } else {
        await signOut(active.id)
      }
    } finally {
      setBusy(false)
    }
  }

  return { active, others, isBusy, handleSwitch, handleSignOut }
}
