import { Check, Minus } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

/* ---------------------------------------------------------------------------
   Selection and bulk actions
--------------------------------------------------------------------------- */

export function SelectBox({
  checked,
  mixed,
  onChange,
  label,
}: {
  checked: boolean
  mixed?: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      aria-checked={mixed ? 'mixed' : checked}
      aria-label={label}
      className={cn(
        'flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border transition-colors',
        checked || mixed
          ? 'border-(--cohort-ink) bg-(--cohort-ink) text-card'
          : 'border-border-strong hover:border-(--cohort-ink)'
      )}
      onClick={onChange}
      role="checkbox"
      type="button"
    >
      {mixed ? <Minus className="size-3" strokeWidth={3} /> : checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </button>
  )
}
