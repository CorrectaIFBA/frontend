import type { CohortRole, CohortState, InvitationState } from '@/shared/api/cohorts'

export const COHORT_STATE_LABEL: Record<CohortState, string> = {
  DRAFT: 'Rascunho',
  ACTIVE: 'Ativa',
  ARCHIVED: 'Arquivada',
}

export const COHORT_ROLE_LABEL: Record<CohortRole, string> = {
  STUDENT: 'Estudante',
  FACULTY: 'Docente',
}

export const INVITATION_LABEL: Record<InvitationState, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  REJECTED: 'Recusado',
  REVOKED: 'Revogado',
  EXPIRED: 'Expirado',
}
