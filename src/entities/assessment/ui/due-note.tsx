import { dueStatus, HOUR } from '@/entities/assessment/lib/due-status'
import type { Assessment } from '@/shared/api/assessments'
import { StatusPill } from '@/shared/ui/status-pill'

/**
 * What the deadline means right now, only when it needs attention: about to
 * close, or closed. Whether late work is accepted stays with faculty
 * (`revealLate`); students only learn the deadline passed. A student who
 * already handed in (`submitted`) is not warned that it is about to close.
 */
export function DueNote({
  assessment,
  revealLate,
  submitted = false,
}: {
  assessment: Pick<Assessment, 'dueDate' | 'parameters'>
  revealLate: boolean
  submitted?: boolean
}) {
  const status = dueStatus(assessment)
  if (status === 'none' || status === 'open' || !assessment.dueDate) return null
  if (status === 'closing' && submitted) return null

  if (status === 'closing') {
    const hours = Math.max(1, Math.round((new Date(assessment.dueDate).getTime() - Date.now()) / HOUR))
    return (
      <StatusPill
        label={hours === 1 ? 'Encerra em menos de 1 hora' : `Encerra em ${hours} horas`}
        tone="bg-warning/12 text-warning [--dot:var(--warning)]"
      />
    )
  }

  return (
    <StatusPill
      label={status === 'late-open' && revealLate ? 'Você ainda pode enviar' : 'Prazo encerrado'}
      tone="bg-muted text-muted-foreground [--dot:var(--muted-foreground)]"
    />
  )
}
