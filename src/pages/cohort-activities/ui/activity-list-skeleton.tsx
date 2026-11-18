import { Skeleton } from '@/shared/ui/skeleton'

export function ActivityListSkeleton() {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="flex gap-4 px-4 py-3.5" key={`activity-${index + 1}`}>
          <Skeleton className="h-[52px] w-12 rounded-md" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <Skeleton className="h-3.5 w-56" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
