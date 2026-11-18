import type { Assessment } from '@/shared/api/assessments'

export const monthFormat = new Intl.DateTimeFormat('pt-BR', { month: 'short' })

export const timeFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

export const dueFormat = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

export const HOUR = 3_600_000

export type DueStatus = 'none' | 'open' | 'closing' | 'late-open' | 'closed'

/** Where the assessment stands against its due date, from the viewer's clock. */
export function dueStatus(assessment: Pick<Assessment, 'dueDate' | 'parameters'>, now = Date.now()): DueStatus {
  if (!assessment.dueDate) return 'none'
  const left = new Date(assessment.dueDate).getTime() - now
  if (left > 48 * HOUR) return 'open'
  if (left > 0) return 'closing'
  return assessment.parameters?.canBeSubmittedAfterDueDate ? 'late-open' : 'closed'
}
