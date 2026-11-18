import { LogOut, Search } from 'lucide-react'
import { AccountAvatar, PROFILE_LABEL } from '@/entities/profile'
import type { SelfAccountInfo } from '@/shared/api/identity'
import { signOut } from '@/shared/api/session'
import { shellDialogs } from '@/shared/lib/shell-dialogs'
import type { useSettingsNavigation } from '@/widgets/app-shell/model/use-settings-navigation'
import { SettingsNavItem } from '@/widgets/app-shell/ui/settings-nav-item'

type SettingsSidebarProps = {
  me: SelfAccountInfo
  navigation: ReturnType<typeof useSettingsNavigation>
}

export function SettingsSidebar({ me, navigation }: SettingsSidebarProps) {
  const { groups, query, setQuery, tab, activeSection, selectTab, goToSection } = navigation

  return (
    <nav className="hidden w-64 shrink-0 flex-col border-border border-r bg-sidebar md:flex">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <AccountAvatar className="size-10 rounded-lg" name={me.person.displayName} type={me.profile.type} />
        <div className="grid min-w-0 leading-tight">
          <span className="truncate font-semibold text-[14px]">{me.person.displayName}</span>
          <button
            className="mt-0.5 w-fit cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground"
            onClick={() => selectTab('account')}
            type="button"
          >
            {PROFILE_LABEL[me.profile.type]} · ver conta
          </button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <label className="flex h-8 items-center gap-2 rounded-md border border-input bg-background/60 px-2.5 text-muted-foreground focus-within:border-ring">
          <Search className="size-3.5 shrink-0" />
          <input
            className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar"
            value={query}
          />
        </label>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-3">
        {groups.map((group) => (
          <div className="flex flex-col gap-px" key={group.label}>
            <span className="label-xs px-2.5 pt-1 pb-2 text-muted-foreground">{group.label}</span>
            {group.tabs.map((definition) => (
              <SettingsNavItem
                activeSection={activeSection}
                definition={definition}
                isSelected={definition.id === tab}
                key={definition.id}
                onSelect={() => selectTab(definition.id)}
                onSelectSection={goToSection}
              />
            ))}
          </div>
        ))}
        {groups.length === 0 ? (
          <p className="px-2.5 py-4 text-muted-foreground text-xs">Nada encontrado para “{query}”.</p>
        ) : null}
      </div>

      <div className="border-border border-t p-3">
        <button
          className="flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-[13px] text-destructive transition-colors hover:bg-destructive/10"
          onClick={async () => {
            shellDialogs.close()
            await signOut(me.profile.profileId)
          }}
          type="button"
        >
          <LogOut className="size-4" />
          Sair desta conta
        </button>
      </div>
    </nav>
  )
}
