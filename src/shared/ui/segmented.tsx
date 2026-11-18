import { cn } from '@/shared/lib/cn'

/** A short set of mutually exclusive filters, all visible at once. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div aria-label={label} className="flex h-8 items-center gap-0.5 rounded-md border border-input bg-card p-0.5" role="radiogroup">
      {options.map((option) => (
        <button
          aria-checked={option.value === value}
          className={cn(
            'h-full cursor-pointer rounded-[0.3rem] px-2.5 text-xs transition-colors',
            option.value === value
              ? 'bg-accent font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          role="radio"
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
