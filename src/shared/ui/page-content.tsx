import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** Width: `--page-width` when the shell sets it, else 6xl. */
export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex w-full max-w-[var(--page-width,72rem)] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8', className)}>
      {children}
    </div>
  )
}
