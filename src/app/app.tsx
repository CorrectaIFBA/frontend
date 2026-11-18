import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/app/router'
import { useSessionSync } from '@/app/use-session-sync'
import { queryClient } from '@/shared/api/query-client'
import { ThemeProvider } from '@/shared/lib/theme-provider'
import { Toaster } from '@/shared/ui/sonner'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface StaticDataRouteOption {
    /** `focus`: the page takes the whole window, without the sidebar, the header or the cohort's frame. */
    chrome?: 'focus'
  }
  interface HistoryState {
    /** Set by the submissions table, so the student's submission page can name the student. */
    studentName?: string
  }
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
