import { ArrowDown, ArrowUp } from 'lucide-react'
import type { SortDirection } from '@/shared/api/directory'
import { cn } from '@/shared/lib/cn'

export function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: SortDirection
  onClick: () => void
}) {
  const Icon = dir === 'asc' ? ArrowUp : ArrowDown

  return (
    <button
      className={cn(
        'group/sort -mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-1 transition-colors hover:bg-accent hover:text-foreground',
        active && 'text-foreground'
      )}
      onClick={onClick}
      type="button"
    >
      {label}
      {/* The arrow shows only where the order is set; hovering previews it elsewhere. */}
      <Icon
        className={cn(
          'size-3 transition-opacity',
          active ? 'opacity-100' : 'opacity-0 group-hover/sort:opacity-50'
        )}
      />
    </button>
  )
}
