import { Skeleton } from '@/shared/ui/skeleton'

export function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-3 w-20" />
      <div className="flex gap-4">
        <Skeleton className="h-[62px] w-16 rounded-md" />
        <div className="flex flex-col gap-2.5 pt-1">
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-56 rounded-lg" />
      </div>
    </div>
  )
}
