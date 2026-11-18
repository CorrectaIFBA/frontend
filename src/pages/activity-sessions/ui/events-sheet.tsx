import { useQuery } from '@tanstack/react-query'
import { EVENT_LABEL, timeOfDay } from '@/pages/activity-sessions/config/event-labels'
import type { Assessment } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { type Session, sessionEventsQueryOptions } from '@/shared/api/sessions'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet'
import { Skeleton } from '@/shared/ui/skeleton'

export function EventsSheet({
  assessment,
  session,
  name,
  onClose,
}: {
  assessment: Assessment
  session: Session | null
  name: string
  onClose: () => void
}) {
  const query = useQuery({
    ...sessionEventsQueryOptions(assessment.id, session?.id ?? ''),
    enabled: Boolean(session),
  })

  return (
    <Sheet onOpenChange={(open) => !open && onClose()} open={Boolean(session)}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-border border-b">
          <SheetTitle>Registro de {name}</SheetTitle>
          <SheetDescription>O início, a entrega e as ações dos docentes, em ordem.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {query.isError ? (
            <p className="p-4 text-muted-foreground text-xs">{errorMessage(query.error)}</p>
          ) : query.isPending ? (
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <ol className="relative flex flex-col px-4 py-3">
              {query.data.map((event) => (
                <li className="relative flex gap-3 py-1.5 pl-4" key={event.id}>
                  <span className="absolute top-[11px] left-0 size-1.5 rounded-full bg-border-strong" />
                  <time className="w-16 shrink-0 text-muted-foreground text-xs tabular-nums" dateTime={event.occurredAt}>
                    {timeOfDay.format(new Date(event.occurredAt))}
                  </time>
                  <div className="flex min-w-0 flex-col gap-0.5 text-xs">
                    <span>{EVENT_LABEL[event.type]}</span>
                    {event.detail ? <span className="text-muted-foreground">{event.detail}</span> : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
