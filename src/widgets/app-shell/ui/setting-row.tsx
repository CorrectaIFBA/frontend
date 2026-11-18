import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function SettingRow({
  label,
  hint,
  value,
  action,
  onClick,
}: {
  label: string
  hint?: string
  value?: ReactNode
  action?: ReactNode
  /** Makes the whole row a link to somewhere else, with a chevron. */
  onClick?: () => void
}) {
  const body = (
    <>
      <span className="grid min-w-0 gap-0.5">
        <span className="font-medium text-[13px]">{label}</span>
        {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
      </span>
      <span className="ml-auto flex min-w-0 items-center gap-3">
        {value ? <span className="truncate text-right text-[13px]">{value}</span> : null}
        {action}
        {onClick ? <ChevronRight className="size-4 shrink-0 text-muted-foreground" /> : null}
      </span>
    </>
  )

  const className = 'flex min-h-14 items-center gap-4 rounded-md py-2'

  if (onClick) {
    return (
      <button
        className={cn(className, '-mx-3 cursor-pointer px-3 text-left transition-colors hover:bg-accent/60')}
        onClick={onClick}
        type="button"
      >
        {body}
      </button>
    )
  }

  return <div className={className}>{body}</div>
}
