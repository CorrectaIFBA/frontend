import { cn } from '@/shared/lib/cn'
import type { SettingsTab } from '@/shared/lib/shell-dialogs'
import { ALL_TABS } from '@/widgets/app-shell/config/settings-tabs'

type SettingsMobileTabsProps = {
  tab: SettingsTab
  onSelect: (tab: SettingsTab) => void
}

/* Below md the sidebar folds into a row of tabs. */
export function SettingsMobileTabs({ tab, onSelect }: SettingsMobileTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-border border-b px-3 py-2 md:hidden">
      {ALL_TABS.map((definition) => (
        <button
          className={cn(
            'flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs',
            definition.id === tab ? 'bg-accent text-foreground' : 'text-muted-foreground'
          )}
          key={definition.id}
          onClick={() => onSelect(definition.id)}
          type="button"
        >
          <definition.icon className="size-3.5" />
          {definition.title}
        </button>
      ))}
    </div>
  )
}
