import {
  BookOpenText,
  ClipboardList,
  FileCode2,
  GraduationCap,
  LayoutGrid,
  type LucideIcon,
  Presentation,
  Send,
  ShieldUser,
  UsersRound,
} from 'lucide-react'
import type { ProfileType } from '@/lib/api/identity'

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  /** One line on what the page is for: the search palette and the placeholders show it. */
  description: string
  /** Match the path exactly — for section roots like `/`. */
  exact?: boolean
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const OVERVIEW_ITEM: NavItem = {
  title: 'Visão geral',
  url: '/',
  icon: LayoutGrid,
  description: 'O que precisa da sua atenção hoje.',
  exact: true,
}

/*
  Grouped by the job a staff member is doing — enrolling people, organising
  terms, running assessments — not by which service owns the data.
*/
export const STAFF_NAV: NavGroup[] = [
  {
    label: 'Pessoas',
    items: [
      {
        title: 'Estudantes',
        url: '/students',
        icon: GraduationCap,
        description: 'Matrículas, contas e situação de ativação dos estudantes.',
      },
      {
        title: 'Docentes',
        url: '/faculty',
        icon: Presentation,
        description: 'Professores, suas turmas e permissões de correção.',
      },
      {
        title: 'Servidores',
        url: '/staff',
        icon: ShieldUser,
        description: 'Equipe administrativa com acesso a este painel.',
      },
    ],
  },
  {
    label: 'Acadêmico',
    items: [
      {
        title: 'Turmas',
        url: '/classes',
        icon: UsersRound,
        description: 'Turmas por período, com docentes e estudantes vinculados.',
      },
      {
        title: 'Disciplinas',
        url: '/courses',
        icon: BookOpenText,
        description: 'Componentes curriculares e suas ementas.',
      },
    ],
  },
  {
    label: 'Avaliação',
    items: [
      {
        title: 'Problemas',
        url: '/problems',
        icon: FileCode2,
        description: 'Banco de problemas com enunciados e casos de teste.',
      },
      {
        title: 'Listas',
        url: '/assignments',
        icon: ClipboardList,
        description: 'Listas de exercícios publicadas para as turmas.',
      },
      {
        title: 'Submissões',
        url: '/submissions',
        icon: Send,
        description: 'Envios corrigidos, vereditos e tempos de execução.',
      },
    ],
  },
]

/* Only staff has a shell so far; other profiles see the overview alone. */
export function navFor(profileType: ProfileType): NavGroup[] {
  return profileType === 'STAFF' ? STAFF_NAV : []
}

export const ALL_PAGES: (NavItem & { group: string })[] = [
  { ...OVERVIEW_ITEM, group: '' },
  ...STAFF_NAV.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label }))),
]

export function pageByUrl(url: string) {
  return ALL_PAGES.find((page) => page.url === url)
}

export const PROFILE_LABEL: Record<ProfileType, string> = {
  STAFF: 'Servidor',
  FACULTY: 'Docente',
  STUDENT: 'Estudante',
}
