import { Minus } from 'lucide-react'
import { TYPE_INFO } from '@/features/manage-testcases/config/testcase-types'
import { TESTCASE_TYPES, type TestcaseType } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'

export function TypePicker({
  value,
  onChange,
  keepLabel,
}: {
  value: TestcaseType | null
  onChange: (value: TestcaseType | 'KEEP') => void
  /** Offers leaving the type as it is, for bulk edits. */
  keepLabel?: string
}) {
  const options: (TestcaseType | 'KEEP')[] = keepLabel ? ['KEEP', ...TESTCASE_TYPES] : TESTCASE_TYPES
  const current = value ?? 'KEEP'

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 font-medium text-sm">Visibilidade para o estudante</legend>
      <div className="grid gap-1.5" role="radiogroup">
        {options.map((option) => {
          const on = option === current
          const info = option === 'KEEP' ? null : TYPE_INFO[option]
          const Icon = info?.icon ?? Minus
          return (
            <button
              aria-checked={on}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 text-left transition-colors',
                on ? 'border-(--cohort-ink)/60 bg-(--cohort-ink)/8' : 'border-input hover:border-border-strong'
              )}
              key={option}
              onClick={() => onChange(option)}
              role="radio"
              type="button"
            >
              <Icon className={cn('mt-0.5 size-4 shrink-0', on ? 'text-(--cohort-ink)' : 'text-muted-foreground')} />
              <span className="flex flex-col gap-0.5">
                <span className="font-medium text-[13px]">{info?.label ?? keepLabel}</span>
                {info ? <span className="text-muted-foreground text-xs">{info.hint}</span> : null}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
