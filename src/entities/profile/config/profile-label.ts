import type { ProfileType } from '@/shared/api/identity'

export const PROFILE_LABEL: Record<ProfileType, string> = {
  STAFF: 'Servidor',
  FACULTY: 'Docente',
  STUDENT: 'Estudante',
}
