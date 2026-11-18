import type { InvitationCandidate } from '@/shared/api/cohorts'

export type Validity = 'none' | '7' | '30'

export const CANDIDATE_NOTE: Record<Exclude<InvitationCandidate['status'], 'AVAILABLE'>, string> = {
  MEMBER: 'Já é membro',
  INVITED: 'Convite pendente',
}
