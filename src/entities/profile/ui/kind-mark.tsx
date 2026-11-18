import type { LucideIcon } from 'lucide-react'
import { PROFILE_TONE } from '@/entities/profile/config/profile-tone'
import type { ProfileType } from '@/shared/api/identity'
import { cn } from '@/shared/lib/cn'

/** The icon of a list, in its profile's hue; neutral for persons. */
export function KindMark({
  icon: Icon,
  type,
  className,
}: {
  icon: LucideIcon
  type?: ProfileType
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-lg border',
        type ? cn(PROFILE_TONE[type].soft, PROFILE_TONE[type].ring) : 'border-border bg-muted/60 text-muted-foreground',
        className
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  )
}
