import { PROFILE_TONE } from '@/entities/profile/config/profile-tone'
import type { ProfileType } from '@/shared/api/identity'
import { cn } from '@/shared/lib/cn'

/** The profile's name in its own hue, for lists where several types meet. */
export function ProfileTypeTag({ type, label, className }: { type: ProfileType; label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1.5 rounded-sm px-1.5 font-medium text-[11px]',
        PROFILE_TONE[type].soft,
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full', PROFILE_TONE[type].dot)} />
      {label}
    </span>
  )
}
