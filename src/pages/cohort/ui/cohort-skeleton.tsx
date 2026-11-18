import { PageContent } from '@/shared/ui/page-content'
import { Skeleton } from '@/shared/ui/skeleton'

export function CohortSkeleton() {
  return (
    <PageContent>
      <Skeleton className="h-3 w-16" />
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Skeleton className="h-24 rounded-none" />
        <div className="flex items-end gap-5 px-5 pb-4">
          <Skeleton className="-mt-10 size-18 rounded-xl ring-4 ring-card" />
          <div className="flex flex-col gap-2.5 pt-3">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>
        <div className="flex h-11 items-center gap-6 border-border border-t px-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </PageContent>
  )
}
