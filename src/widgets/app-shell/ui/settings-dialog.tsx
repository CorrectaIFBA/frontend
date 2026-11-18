import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { SelfAccountInfo } from '@/shared/api/identity'
import { type SettingsTab, shellDialogs } from '@/shared/lib/shell-dialogs'
import { DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { useSettingsNavigation } from '@/widgets/app-shell/model/use-settings-navigation'
import { SettingsMobileTabs } from '@/widgets/app-shell/ui/settings-mobile-tabs'
import { SettingsSidebar } from '@/widgets/app-shell/ui/settings-sidebar'
import { SettingsTabContent } from '@/widgets/app-shell/ui/settings-tab-content'

type SettingsDialogProps = {
  me: SelfAccountInfo
  tab: SettingsTab
}

/**
 * Account and preferences in one place, laid out like a desktop app's
 * settings: tabs on the left, the open tab's headings nested beneath it.
 */
export function SettingsDialog({ me, tab: initialTab }: SettingsDialogProps) {
  const navigation = useSettingsNavigation(initialTab)

  return (
    <div className="flex h-full min-h-0">
      <SettingsSidebar me={me} navigation={navigation} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-border border-b px-5">
          <DialogTitle className="font-semibold text-[14px]">{navigation.current.title}</DialogTitle>
          <DialogDescription className="sr-only">Configurações da sua conta</DialogDescription>
          <button
            aria-label="Fechar configurações"
            className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => shellDialogs.close()}
            type="button"
          >
            <span className="hidden font-mono text-[10px] sm:inline">ESC</span>
            <X className="size-4" />
          </button>
        </header>

        <SettingsMobileTabs onSelect={navigation.selectTab} tab={navigation.tab} />

        <div className="min-h-0 flex-1 overflow-y-auto" onScroll={navigation.onContentScroll} ref={navigation.scrollRef}>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-[680px] px-6 py-8 sm:px-10 sm:py-10"
            initial={{ opacity: 0, y: 6 }}
            key={navigation.tab}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
          >
            <SettingsTabContent me={me} onSelectTab={navigation.selectTab} tab={navigation.tab} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
