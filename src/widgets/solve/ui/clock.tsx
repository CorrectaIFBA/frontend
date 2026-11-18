import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { formatRemaining, URGENT_MS } from '@/entities/session'
import { cn } from '@/shared/lib/cn'
import { useSolve } from '@/widgets/solve/model/solve-context'
import { useClock } from '@/widgets/solve/model/use-clock'

export function Clock() {
  const { coding } = useSolve()
  const remaining = useClock()
  const [warned, setWarned] = useState<'five' | 'one' | null>(null)

  useEffect(() => {
    if (remaining === null) return
    if (remaining <= 60_000 && warned !== 'one' && remaining > 0) {
      setWarned('one')
      toast.warning('Falta 1 minuto. O que estiver enviado até lá é o que vale.')
    } else if (remaining <= URGENT_MS && remaining > 60_000 && warned === null) {
      setWarned('five')
      toast.warning('Faltam 5 minutos.')
    }
    // At zero the service has the final word: ask it, instead of deciding here.
    if (remaining === 0) coding.check()
  }, [remaining, warned, coding])

  if (remaining === null) return null

  return (
    <span
      aria-label={`Tempo restante: ${formatRemaining(remaining)}`}
      className={cn(
        'inline-flex h-7 items-center rounded-md border px-2 font-mono font-medium text-[13px] tabular-nums',
        remaining <= URGENT_MS ? 'border-warning/40 bg-warning/10 text-warning' : 'border-border'
      )}
      role="timer"
    >
      {formatRemaining(remaining)}
    </span>
  )
}
