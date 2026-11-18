import type { ProgrammingLanguage } from '@/shared/api/assessments'
import { LANGUAGE_LABEL } from '@/shared/editor/languages'
import { cn } from '@/shared/lib/cn'

type LanguageTabsProps = {
  allowed: ProgrammingLanguage[]
  current: ProgrammingLanguage
  onSelect: (language: ProgrammingLanguage) => void
}

export function LanguageTabs({ allowed, current, onSelect }: LanguageTabsProps) {
  return (
    <div aria-label="Código de qual linguagem" className="flex gap-1 border-border border-b px-3" role="tablist">
      {allowed.map((item) => (
        <button
          aria-selected={item === current}
          className={cn(
            'relative h-9 cursor-pointer px-2.5 text-xs transition-colors',
            item === current
              ? 'font-medium text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-(--cohort-ink)'
              : 'text-muted-foreground hover:text-foreground'
          )}
          key={item}
          onClick={() => onSelect(item)}
          role="tab"
          type="button"
        >
          {LANGUAGE_LABEL[item]}
        </button>
      ))}
    </div>
  )
}
