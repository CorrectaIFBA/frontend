import { Bell, type LucideIcon, MonitorSmartphone, Palette, UserRound } from 'lucide-react'
import type { SettingsTab } from '@/shared/lib/shell-dialogs'

type Section = { id: string; title: string }

export type TabDefinition = {
  id: SettingsTab
  title: string
  icon: LucideIcon
  keywords: string[]
  /** Headings inside the tab, listed under it in the sidebar while it is open. */
  sections?: Section[]
}

export const TAB_GROUPS: { label: string; tabs: TabDefinition[] }[] = [
  {
    label: 'Usuário',
    tabs: [
      {
        id: 'account',
        title: 'Minha conta',
        icon: UserRound,
        keywords: ['nome', 'login', 'e-mail', 'senha', 'segurança', 'status'],
        sections: [
          { id: 'account-info', title: 'Informações da conta' },
          { id: 'account-security', title: 'Senha e segurança' },
          { id: 'account-status', title: 'Status da conta' },
        ],
      },
      {
        id: 'sessions',
        title: 'Sessões',
        icon: MonitorSmartphone,
        keywords: ['dispositivos', 'encerrar', 'navegador'],
      },
    ],
  },
  {
    label: 'Preferências',
    tabs: [
      {
        id: 'appearance',
        title: 'Aparência',
        icon: Palette,
        keywords: ['tema', 'claro', 'escuro', 'idioma'],
      },
      {
        id: 'notifications',
        title: 'Notificações',
        icon: Bell,
        keywords: ['e-mail', 'avisos', 'resumo'],
      },
    ],
  },
]

export const ALL_TABS = TAB_GROUPS.flatMap((group) => group.tabs)
