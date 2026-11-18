import { Skeleton } from '@/shared/ui/skeleton'

/* The shell's silhouette while the session is restored, so nothing jumps. */
export function ShellSkeleton() {
  return (
    <div className="flex min-h-svh bg-sidebar">
      <div className="hidden w-64 shrink-0 flex-col gap-6 p-4 md:flex">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-7 rounded-lg" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="flex flex-col gap-3.5 pt-2">
          {[20, 28, 24, 16, 22, 26, 18].map((width, index) => (
            <Skeleton className="h-3" key={`nav-${index + 1}`} style={{ width: `${width * 4}px` }} />
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col bg-background md:m-2 md:ml-0 md:rounded-lg md:ring-1 md:ring-border">
        <div className="flex h-13 items-center justify-between gap-4 border-border border-b px-5">
          <Skeleton className="size-6" />
          <Skeleton className="h-8 w-full max-w-md rounded-md" />
          <Skeleton className="size-7 rounded-md" />
        </div>
      </div>
    </div>
  )
}
