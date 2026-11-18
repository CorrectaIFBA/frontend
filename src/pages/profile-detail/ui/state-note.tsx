import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function StateNote({ tone, children }: { tone: 'warning' | 'muted'; children: ReactNode }) {
  return (
    <p
      className={cn(
        'rounded-lg border px-4 py-3 text-muted-foreground text-xs leading-relaxed',
        tone === 'warning' ? 'border-warning/30 bg-warning/8' : 'border-border bg-muted/40'
      )}
    >
      {children}
    </p>
  )
}
