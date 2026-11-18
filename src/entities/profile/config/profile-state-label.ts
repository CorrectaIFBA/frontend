import type { ProfileState } from '@/shared/api/identity'

export const PROFILE_STATE_LABEL: Record<ProfileState, string> = {
  PENDING: 'Pendente',
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}
