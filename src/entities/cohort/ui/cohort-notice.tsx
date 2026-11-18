import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** An empty or unavailable section: what will be here, and what to do about it. */
export function CohortNotice({
  icon: Icon,
  title,
  hint,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  hint: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'paper-grid flex flex-col items-center gap-2 rounded-lg border border-border border-dashed px-6 py-14 text-center',
        className
      )}
    >
      <span className="mb-1 flex size-10 items-center justify-center rounded-lg border border-border bg-card text-[var(--cohort-ink,var(--muted-foreground))]">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <p className="font-medium text-[13px]">{title}</p>
      <p className="max-w-sm text-muted-foreground text-xs leading-relaxed">{hint}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
