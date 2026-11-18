import { PageContent } from '@/shared/ui/page-content'
import { Panel } from '@/shared/ui/panel'
import { Skeleton } from '@/shared/ui/skeleton'

export function DetailSkeleton() {
  return (
    <PageContent>
      <Skeleton className="h-3 w-24" />
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel>
          <div className="h-11 border-border border-b px-4 py-4">
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="divide-y divide-border/70 px-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="grid gap-4 py-3.5 sm:grid-cols-[9rem_1fr]" key={`fact-${index + 1}`}>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-44" />
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Panel>
      </div>
    </PageContent>
  )
}
