import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { queryClient } from '@/shared/api/query-client'

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  // Route loaders read through React Query, which owns freshness.
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})
