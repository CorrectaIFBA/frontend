import { Skeleton } from '@/shared/ui/skeleton'

export function CohortCardSkeleton() {
  return (
    <div className="flex min-h-60 flex-col overflow-hidden rounded-lg border border-border bg-card">
      <Skeleton className="h-24 rounded-none" />
      <div className="flex flex-col gap-2.5 px-4 pt-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="mt-auto flex items-center justify-between border-border/70 border-t px-4 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}
