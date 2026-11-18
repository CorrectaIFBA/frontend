import type { SelfAccountInfo } from '@/shared/api/identity'
import type { SettingsTab } from '@/shared/lib/shell-dialogs'
import { AccountTab } from '@/widgets/app-shell/ui/account-tab'
import { AppearanceTab } from '@/widgets/app-shell/ui/appearance-tab'
import { NotificationsTab } from '@/widgets/app-shell/ui/notifications-tab'
import { SessionsTab } from '@/widgets/app-shell/ui/sessions-tab'

type SettingsTabContentProps = {
  me: SelfAccountInfo
  tab: SettingsTab
  onSelectTab: (tab: SettingsTab) => void
}

export function SettingsTabContent({ me, tab, onSelectTab }: SettingsTabContentProps) {
  if (tab === 'account') return <AccountTab me={me} onOpenSessions={() => onSelectTab('sessions')} />
  if (tab === 'sessions') return <SessionsTab accountId={me.profile.profileId} />
  if (tab === 'appearance') return <AppearanceTab />

  return <NotificationsTab />
}
