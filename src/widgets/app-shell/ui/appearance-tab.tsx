import { cn } from '@/shared/lib/cn'
import { useTheme } from '@/shared/lib/theme-provider'
import { THEMES } from '@/widgets/app-shell/config/themes'
import { SettingRow } from '@/widgets/app-shell/ui/setting-row'
import { SettingsSection } from '@/widgets/app-shell/ui/settings-section'
import { ThemePreview } from '@/widgets/app-shell/ui/theme-preview'

export function AppearanceTab() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <SettingsSection title="Tema">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((option) => (
            <button
              aria-pressed={theme === option.value}
              className={cn(
                'group flex cursor-pointer flex-col gap-2.5 rounded-lg border p-2.5 text-left transition-colors',
                theme === option.value
                  ? 'border-primary bg-primary/6'
                  : 'border-border hover:border-border-strong'
              )}
              key={option.value}
              onClick={() => setTheme(option.value)}
              type="button"
            >
              <ThemePreview variant={option.value} />
              <span className="flex items-center gap-1.5 px-0.5 text-[13px]">
                <option.icon className="size-3.5 text-muted-foreground" />
                {option.label}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-muted-foreground text-xs">Salvo neste navegador.</p>
      </SettingsSection>

      <SettingsSection title="Idioma">
        <SettingRow hint="Outros idiomas chegam depois." label="Português (Brasil)" value="Padrão" />
      </SettingsSection>
    </>
  )
}
