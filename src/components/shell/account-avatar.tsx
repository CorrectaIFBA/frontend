import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function AccountAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={cn('size-7 rounded-md', className)}>
      <AvatarFallback className="rounded-md bg-primary/12 font-semibold text-[11px] text-primary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
