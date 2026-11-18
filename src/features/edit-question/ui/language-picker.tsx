import { Check } from 'lucide-react'
import { PROGRAMMING_LANGUAGES, type ProgrammingLanguage } from '@/shared/api/assessments'
import { LANGUAGE_LABEL } from '@/shared/editor/languages'
import { cn } from '@/shared/lib/cn'

type LanguagePickerProps = {
  allowed: ProgrammingLanguage[]
  onToggle: (language: ProgrammingLanguage) => void
}

export function LanguagePicker({ allowed, onToggle }: LanguagePickerProps) {
  return (
    <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2 border-border border-b px-4 py-3">
      <legend className="sr-only">Linguagens permitidas</legend>
      <span aria-hidden className="text-muted-foreground text-xs">
        Linguagens permitidas
      </span>
      <div className="flex flex-wrap gap-1.5">
        {PROGRAMMING_LANGUAGES.map((item) => {
          const isAllowed = allowed.includes(item)
          const isLast = isAllowed && allowed.length === 1

          return (
            <button
              aria-pressed={isAllowed}
              className={cn(
                'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors disabled:cursor-not-allowed',
                isAllowed
                  ? 'border-(--cohort-ink)/50 bg-(--cohort-ink)/10 font-medium text-foreground'
                  : 'border-input text-muted-foreground hover:text-foreground'
              )}
              // The last allowed language stays: a question needs at least one.
              disabled={isLast}
              key={item}
              onClick={() => onToggle(item)}
              title={isLast ? 'A questão precisa de ao menos uma linguagem.' : undefined}
              type="button"
            >
              <span
                aria-hidden
                className={cn(
                  'flex size-3.5 items-center justify-center rounded-[3px] border',
                  isAllowed ? 'border-(--cohort-ink) bg-(--cohort-ink) text-card' : 'border-border-strong'
                )}
              >
                {isAllowed ? <Check className="size-2.5" strokeWidth={3} /> : null}
              </span>
              {LANGUAGE_LABEL[item]}
            </button>
          )
        })}
      </div>
      <span className="ml-auto text-muted-foreground text-xs">
        {allowed.length === 1 ? 'O estudante responde nesta linguagem.' : 'O estudante escolhe uma delas.'}
      </span>
    </fieldset>
  )
}
