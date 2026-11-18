import { Remaining, useRemaining } from '@/entities/session'
import type { Session } from '@/shared/api/sessions'

export type RemainingCellProps = { session: Session | null }

export function RemainingCell({ session }: RemainingCellProps) {
  const remaining = useRemaining(session)

  if (!session) return <span className="text-muted-foreground/60">—</span>
  if (remaining === null) return <span className="text-muted-foreground text-xs">Sem limite</span>

  return <Remaining ms={remaining} />
}
