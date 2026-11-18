import { BookOpenText, ClipboardList, FileCode2, GraduationCap, IdCard, LayoutGrid, type LucideIcon, Presentation, Send, ShieldUser, UsersRound } from 'lucide-react'
import type { ProfileType } from '@/shared/api/identity'

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
        title: 'Pessoas',
        url: '/persons',
        icon: IdCard,
        description: 'Cadastro por CPF e os perfis institucionais de cada pessoa.',
      },
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
        description: 'Perfis de docente, contas e situação de ativação.',
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

/* Faculty and students work inside cohorts; that is all their shell holds so far. */
export const MEMBER_NAV: NavGroup[] = [
  {
    label: 'Acadêmico',
    items: [
      {
        title: 'Turmas',
        url: '/classes',
        icon: UsersRound,
        description: 'As turmas que você criou ou das quais participa.',
      },
    ],
  },
]

export function navFor(profileType: ProfileType): NavGroup[] {
  return profileType === 'STAFF' ? STAFF_NAV : MEMBER_NAV
}

/* For faculty and students the cohort list is the home page, so it has no separate overview. */
export function topLevelFor(profileType: ProfileType): NavItem[] {
  return profileType === 'STAFF' ? [OVERVIEW_ITEM] : []
}

export const ALL_PAGES: (NavItem & { group: string })[] = [
  { ...OVERVIEW_ITEM, group: '' },
  ...STAFF_NAV.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label }))),
]

export function pageByUrl(url: string) {
  return ALL_PAGES.find((page) => page.url === url)
}
