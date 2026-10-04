import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { NotFound } from '@/components/not-found'

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((module) => ({
        default: module.TanStackRouterDevtools,
      }))
    )
  : () => null

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Suspense>
        <RouterDevtools position="bottom-left" />
      </Suspense>
    </>
  )
}
