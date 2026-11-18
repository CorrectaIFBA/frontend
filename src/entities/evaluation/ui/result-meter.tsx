import { cn } from '@/shared/lib/cn'

type ResultMeterProps = {
  /** 0 to 100. */
  percentage: number
  className?: string
}

/* A thin bar for a share of test cases passed: green when all passed, red when none did. */
export function ResultMeter({ percentage, className }: ResultMeterProps) {
  const fill = percentage >= 100 ? 'bg-success' : percentage <= 0 ? 'bg-destructive' : 'bg-warning'

  return (
    <span aria-hidden className={cn('block h-1 overflow-hidden rounded-full bg-muted', className)}>
      <span className={cn('block h-full rounded-full', fill)} style={{ width: `${Math.max(percentage, 0)}%` }} />
    </span>
  )
}
