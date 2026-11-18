import { URGENT_MS } from '@/entities/session'
import { cn } from '@/shared/lib/cn'
import { useSolve } from '@/widgets/solve/model/solve-context'
import { useClock } from '@/widgets/solve/model/use-clock'

export function Fuse() {
  const { coding } = useSolve()
  const remaining = useClock()
  const { session } = coding
  if (remaining === null || !session.expiresAt) return null

  const total = new Date(session.expiresAt).getTime() - new Date(session.startedAt).getTime()
  const share = total > 0 ? Math.min(1, remaining / total) : 0

  return (
    <div aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 bg-transparent">
      <div
        className={cn(
          'h-full transition-[width] duration-1000 ease-linear motion-reduce:transition-none',
          remaining <= URGENT_MS ? 'bg-warning' : 'bg-(--cohort-ink)'
        )}
        style={{ width: `${share * 100}%` }}
      />
    </div>
  )
}
