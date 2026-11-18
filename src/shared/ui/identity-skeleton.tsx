import { Skeleton } from '@/shared/ui/skeleton'

export function IdentitySkeleton() {
  return (
    <span className="flex items-center gap-3">
      <Skeleton className="size-8 rounded-md" />
      <span className="grid gap-1.5">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-2.5 w-20" />
      </span>
    </span>
  )
}
