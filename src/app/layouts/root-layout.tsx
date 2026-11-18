import { HeadContent, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((module) => ({
        default: module.TanStackRouterDevtools,
      }))
    )
  : () => null

export function RootLayout() {
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
