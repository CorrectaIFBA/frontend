import { Skeleton } from '@/shared/ui/skeleton'
import { SolveScreen } from '@/widgets/solve/ui/solve-screen'

export function SolveSkeleton() {
  return (
    <SolveScreen>
      <div className="flex h-12 items-center gap-3 border-border border-b px-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="ml-auto h-7 w-20" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-[380px] flex-col gap-3 border-border border-r p-5 md:flex">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="flex-1 rounded-none" />
      </div>
    </SolveScreen>
  )
}
