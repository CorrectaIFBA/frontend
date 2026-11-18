import { dueStatus } from '@/entities/assessment'
import type { Assessment } from '@/shared/api/assessments'

/** Why the student cannot start, or `null` when they can. */
export function startBlocker(assessment: Assessment, cohortStatus: string) {
  if (dueStatus(assessment) === 'closed') return 'O prazo terminou: a atividade não pode mais ser iniciada.'
  if (cohortStatus !== 'ACTIVE') return 'A turma não está ativa: a atividade não pode ser iniciada.'
  return null
}
