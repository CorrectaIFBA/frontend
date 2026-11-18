import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/app/layouts/app-layout'
import { ShellError } from '@/app/layouts/shell-error'
import { ShellSkeleton } from '@/app/layouts/shell-skeleton'
import { accountStore } from '@/shared/api/account-store'
import { SessionExpiredError } from '@/shared/api/errors'
import { meQueryOptions } from '@/shared/api/session'
import { tokenManager } from '@/shared/api/token-manager'

export const Route = createFileRoute('/_app')({
  /*
    The only gate into the app. No stored account: straight to login. A stored
    account: `/account/me` is loaded through React Query, which on a fresh
    page load is also what mints the first access token from the refresh
    token. A refresh token the server no longer accepts ends here too.
  */
  beforeLoad: async ({ context, location }) => {
    const account = accountStore.active()

    if (!account) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }

    try {
      // Free when a fresh token is in memory; otherwise proves the session is
      // still alive before cached data for it is shown.
      await tokenManager.getAccessToken(account.id)
      await context.queryClient.ensureQueryData(meQueryOptions(account.id))
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        throw redirect({ to: '/login', search: { redirect: location.href } })
      }
      throw error
    }

    return { accountId: account.id }
  },
  pendingComponent: ShellSkeleton,
  pendingMs: 150,
  errorComponent: ShellError,
  component: AppLayout,
})
