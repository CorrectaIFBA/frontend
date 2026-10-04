import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { JudgePanel } from '@/components/auth/judge-panel'
import { Wordmark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

/**
 * Form on the left, a submission being judged on the right. The panel lives
 * here rather than in each screen so it keeps running while screens change.
 */
function AuthLayout() {
  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:p-3">
      <div className="flex min-w-0 flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <Wordmark />
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[380px]"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key={pathname}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground text-xs">
          <span>Juiz online do IFBA</span>
          <span className="font-mono text-[11px]">v0.1</span>
        </footer>
      </div>

      <JudgePanel />
    </div>
  )
}
