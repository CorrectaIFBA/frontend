import { useSuspenseQuery } from '@tanstack/react-query'
import { Outlet, getRouteApi } from '@tanstack/react-router'
import { RouteProgress } from '@/app/layouts/route-progress'
import { meQueryOptions } from '@/shared/api/session'
import { useFocusChrome } from '@/shared/lib/use-focus-chrome'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import { AppHeader, AppSidebar, ShellDialogs } from '@/widgets/app-shell'
import { SessionBanner } from '@/widgets/session-banner'

const route = getRouteApi('/_app')

export function AppLayout() {
  const { accountId } = route.useRouteContext()
  const { data: me } = useSuspenseQuery(meQueryOptions(accountId))
  const focus = useFocusChrome()

  // The coding page draws its own header; the rest of the shell would only pull the student away.
  if (focus) {
    return (
      <div className="flex h-svh flex-col bg-background">
        <RouteProgress />
        <Outlet />
      </div>
    )
  }

  // Students only move between their cohorts: no sidebar, and the pages take the width it left.
  if (me.profile.type === 'STUDENT') {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <RouteProgress />
        <AppHeader me={me} />
        <SessionBanner />
        <main className="flex flex-1 flex-col [--page-width:88rem]">
          <Outlet />
        </main>
        <ShellDialogs me={me} />
      </div>
    )
  }

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
