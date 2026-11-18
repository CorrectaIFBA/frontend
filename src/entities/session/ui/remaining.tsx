import { formatRemaining, URGENT_MS } from '@/entities/session/lib/format-remaining'
import { cn } from '@/shared/lib/cn'

export function Remaining({ ms, className }: { ms: number; className?: string }) {
  return (
    <span
      className={cn('font-medium tabular-nums', ms <= URGENT_MS && 'text-warning', className)}
      role="timer"
    >
      {formatRemaining(ms)}
    </span>
  )
}
