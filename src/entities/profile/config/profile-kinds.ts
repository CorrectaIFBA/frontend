import { GraduationCap, type LucideIcon, Presentation, ShieldUser } from 'lucide-react'
import type { ProfileType } from '@/shared/api/identity'

export type ProfileKind = {
  type: ProfileType
  /** The list route; the detail route is `${url}/$profileId`. */
  url: '/students' | '/faculty' | '/staff'
  title: string
  singular: string
  icon: LucideIcon
  description: string
}

export const PROFILE_KINDS: Record<ProfileType, ProfileKind> = {
  STUDENT: {
    type: 'STUDENT',
    url: '/students',
    title: 'Estudantes',
    singular: 'Estudante',
    icon: GraduationCap,
    description: 'Perfis de estudante, contas e situação de ativação.',
  },
  FACULTY: {
    type: 'FACULTY',
    url: '/faculty',
    title: 'Docentes',
    singular: 'Docente',
    icon: Presentation,
    description: 'Perfis de docente, contas e situação de ativação.',
  },
  STAFF: {
    type: 'STAFF',
    url: '/staff',
    title: 'Colegiado',
    singular: 'Colegiado',
    icon: ShieldUser,
    description: 'Equipe administrativa com acesso a este painel.',
  },
}
