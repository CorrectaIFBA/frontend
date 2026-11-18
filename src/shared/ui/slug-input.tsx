import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/*
  An address field: the fixed parts of the URL around the editable slug.
  The field goes inside as a child so a form control can wrap it.
*/
export function SlugInput({ prefix, suffix, children }: { prefix: string; suffix?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex h-9 min-w-0 items-center rounded-md border border-input pl-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/15 hover:border-border-strong has-aria-invalid:border-destructive',
        suffix && 'pr-3'
      )}
    >
      <span aria-hidden className="shrink-0 select-none truncate font-mono text-muted-foreground text-xs">
        {prefix}
      </span>
      {children}
      {suffix ? (
        <span aria-hidden className="shrink-0 select-none font-mono text-muted-foreground text-xs">
          {suffix}
        </span>
      ) : null}
    </div>
  )
}
