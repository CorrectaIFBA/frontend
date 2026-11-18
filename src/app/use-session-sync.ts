import { useEffect } from 'react'
import { toast } from 'sonner'
import { router } from '@/app/router'
import { accountStore } from '@/shared/api/account-store'
import { tokenManager } from '@/shared/api/token-manager'

/**
 * Re-runs route guards when the signed-in accounts change, whether this tab
 * changed them or another one did: a sign-out anywhere sends every tab back
 * to the login screen, a switch re-renders the shell as the new account.
 */
export function useSessionSync() {
  useEffect(() => {
    let previous = accountStore.getSnapshot().activeId

    const unsubscribe = accountStore.subscribe(() => {
      const next = accountStore.getSnapshot().activeId
      if (next === previous) return
      previous = next
      router.invalidate()
    })

    const stopExpired = tokenManager.onExpired(() => {
      toast.warning('Sua sessão expirou. Entre novamente para continuar.')
    })

    return () => {
      unsubscribe()
      stopExpired()
    }
  }, [])
}
