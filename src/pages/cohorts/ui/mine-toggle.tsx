import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type MineToggleProps = {
  isOn: boolean
  onToggle: () => void
}

export function MineToggle({ isOn, onToggle }: MineToggleProps) {
  return (
    <button
      aria-pressed={isOn}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors',
        isOn
          ? 'border-ring/50 bg-primary/8 font-medium text-foreground'
          : 'border-input bg-card text-muted-foreground hover:text-foreground'
      )}
      onClick={onToggle}
      type="button"
    >
      {isOn ? <Check className="size-3.5 text-primary" /> : null}
      Criadas por mim
    </button>
  )
}
