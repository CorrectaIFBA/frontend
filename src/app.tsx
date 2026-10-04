import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { accountStore } from '@/lib/auth/account-store'
import { tokenManager } from '@/lib/auth/token-manager'
import { queryClient } from '@/lib/query-client'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  // Route loaders read through React Query, which owns freshness.
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/**
 * Re-runs route guards when the signed-in accounts change, whether this tab
 * changed them or another one did: a sign-out anywhere sends every tab back
 * to the login screen, a switch re-renders the shell as the new account.
 */
function useSessionSync() {
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

export function App() {
  useSessionSync()

  return (
    <ThemeProvider defaultTheme="system" storageKey="correcta.theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
