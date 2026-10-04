import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { WifiOff } from 'lucide-react'
import { AppHeader } from '@/components/shell/app-header'
import { AppSidebar } from '@/components/shell/app-sidebar'
import { ShellDialogs } from '@/components/shell/dialogs'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { errorMessage, SessionExpiredError } from '@/lib/api/errors'
import { accountStore } from '@/lib/auth/account-store'
import { meQueryOptions } from '@/lib/auth/session'
import { tokenManager } from '@/lib/auth/token-manager'

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

function AppLayout() {
  const { accountId } = Route.useRouteContext()
  const { data: me } = useSuspenseQuery(meQueryOptions(accountId))

  return (
    <SidebarProvider>
      <RouteProgress />
      <AppSidebar profileType={me.profile.type} />
      <SidebarInset className="min-h-svh md:min-h-[calc(100svh-1rem)]">
        <AppHeader me={me} />
        <Outlet />
      </SidebarInset>
      <ShellDialogs me={me} />
    </SidebarProvider>
  )
}

function RouteProgress() {
  const pending = useRouterState({ select: (state) => state.status === 'pending' })

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden opacity-0 transition-opacity data-[pending=true]:opacity-100 data-[pending=true]:delay-150"
      data-pending={pending}
    >
      <div className="h-full w-1/3 animate-route-progress bg-primary" />
    </div>
  )
}

/* The shell's silhouette while the session is restored, so nothing jumps. */
function ShellSkeleton() {
  return (
    <div className="flex min-h-svh bg-sidebar">
      <div className="hidden w-64 shrink-0 flex-col gap-6 p-4 md:flex">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-7 rounded-lg" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="flex flex-col gap-3.5 pt-2">
          {[20, 28, 24, 16, 22, 26, 18].map((width, index) => (
            <Skeleton className="h-3" key={`nav-${index + 1}`} style={{ width: `${width * 4}px` }} />
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col bg-background md:m-2 md:ml-0 md:rounded-lg md:ring-1 md:ring-border">
        <div className="flex h-13 items-center justify-between gap-4 border-border border-b px-5">
          <Skeleton className="size-6" />
          <Skeleton className="h-8 w-full max-w-md rounded-md" />
          <Skeleton className="size-7 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function ShellError({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="paper-grid flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
        <WifiOff className="size-5" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-semibold text-lg">Não foi possível carregar o painel</h1>
        <p className="max-w-sm text-muted-foreground text-sm">{errorMessage(error)}</p>
      </div>
      <Button onClick={() => router.invalidate()} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}
