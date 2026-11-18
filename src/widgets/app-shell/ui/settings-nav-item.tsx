import { cn } from '@/shared/lib/cn'
import type { TabDefinition } from '@/widgets/app-shell/config/settings-tabs'

type SettingsNavItemProps = {
  definition: TabDefinition
  isSelected: boolean
  activeSection: string | null
  onSelect: () => void
  onSelectSection: (id: string) => void
}

export function SettingsNavItem({ definition, isSelected, activeSection, onSelect, onSelectSection }: SettingsNavItemProps) {
  return (
    <div>
      <button
        aria-current={isSelected ? 'page' : undefined}
        className={cn(
          'flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-left text-[13px] transition-colors',
          isSelected
            ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
        )}
        onClick={onSelect}
        type="button"
      >
        <definition.icon className={cn('size-4', isSelected ? 'text-sidebar-primary' : 'opacity-60')} />
        {definition.title}
      </button>

      {isSelected && definition.sections ? (
        <div className="mt-1 mb-1 ml-[1.15rem] flex flex-col border-sidebar-border border-l">
          {definition.sections.map((section) => (
            <button
              className={cn(
                '-ml-px cursor-pointer border-l py-1.5 pl-3.5 text-left text-xs transition-colors',
                activeSection === section.id
                  ? 'border-sidebar-primary text-sidebar-foreground'
                  : 'border-transparent text-sidebar-foreground/55 hover:text-sidebar-foreground'
              )}
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              type="button"
            >
              {section.title}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
