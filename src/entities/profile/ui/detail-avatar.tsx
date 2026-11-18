import { AccountAvatar } from '@/entities/profile/ui/account-avatar'
import type { ProfileType } from '@/shared/api/identity'

/** A large monogram for the top of a detail page. */
export function DetailAvatar({ name, type }: { name: string; type?: ProfileType }) {
  return (
    <AccountAvatar
      className="size-14 rounded-xl"
      fallbackClassName="rounded-xl text-lg tracking-tight"
      name={name}
      type={type}
    />
  )
}
