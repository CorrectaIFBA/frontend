import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** A one-line note on a panel: why something is read-only or unavailable. */
export function PanelNote({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'warning' }) {
  return (
    <p
      className={cn(
        'rounded-md border px-3 py-2.5 text-muted-foreground text-xs leading-relaxed',
        tone === 'warning' ? 'border-warning/30 bg-warning/8' : 'border-border bg-muted/40'
      )}
    >
      {children}
    </p>
  )
}
