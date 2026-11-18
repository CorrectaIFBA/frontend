import type { ReactNode } from 'react'
import { AccountAvatar } from '@/entities/profile/ui/account-avatar'
import type { ProfileType } from '@/shared/api/identity'

/** Avatar, name and a quieter second line: the cell that says who a row is. */
export function IdentityCell({
  name,
  type,
  secondary,
}: {
  name: string
  type?: ProfileType
  secondary?: ReactNode
}) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <AccountAvatar className="size-8" name={name} type={type} variant="soft" />
      <span className="grid min-w-0 gap-0.5 leading-tight">
        <span className="truncate font-medium text-foreground">{name}</span>
        {secondary ? <span className="truncate text-muted-foreground text-xs">{secondary}</span> : null}
      </span>
    </span>
  )
}
