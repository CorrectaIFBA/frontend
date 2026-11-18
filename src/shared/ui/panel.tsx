import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      {children}
    </section>
  )
}
