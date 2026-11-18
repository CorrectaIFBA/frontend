import { PROFILE_TONE } from '@/entities/profile/config/profile-tone'
import { initials } from '@/entities/profile/lib/initials'
import type { ProfileType } from '@/shared/api/identity'
import { cn } from '@/shared/lib/cn'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

export function AccountAvatar({
  name,
  type,
  variant = 'solid',
  className,
  fallbackClassName,
}: {
  name: string
  /** Colours the avatar by profile; without one it stays neutral. */
  type?: ProfileType
  variant?: 'solid' | 'soft'
  className?: string
  fallbackClassName?: string
}) {
  return (
    <Avatar className={cn('size-7 rounded-md', className)}>
      <AvatarFallback
        className={cn(
          'rounded-md font-semibold text-[11px]',
          type ? PROFILE_TONE[type][variant] : 'bg-muted text-muted-foreground',
          fallbackClassName
        )}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
