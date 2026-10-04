import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8', className)}>
      {children}
    </div>
  )
}

export function PageTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        {eyebrow ? <span className="label-xs text-muted-foreground">{eyebrow}</span> : null}
        <h1 className="font-semibold text-[22px] tracking-[-0.03em]">{title}</h1>
        {description ? (
          <p className="max-w-prose text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      {children}
    </section>
  )
}

export function PanelHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex h-11 items-center justify-between gap-3 border-border border-b px-4">
      <h2 className="font-semibold text-[13px]">{title}</h2>
      {action}
    </div>
  )
}
