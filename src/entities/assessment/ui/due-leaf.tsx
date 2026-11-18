import { dueStatus, monthFormat, timeFormat } from '@/entities/assessment/lib/due-status'
import type { Assessment } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'

/*
  The due date as a torn-off calendar leaf: month, day and the hour it
  closes, read as one date. The cohort's colour heads it; a closed deadline
  greys out, and no deadline leaves the leaf blank. It keeps its own height
  however tall the row beside it grows.
*/
export function DueLeaf({
  assessment,
  className,
}: {
  assessment: Pick<Assessment, 'dueDate' | 'parameters' | 'state'>
  className?: string
}) {
  const status = dueStatus(assessment)
  const due = assessment.dueDate ? new Date(assessment.dueDate) : null
  const faded = status === 'closed' || status === 'late-open' || assessment.state === 'ARCHIVED'

  return (
    <span
      aria-hidden
      className={cn(
        'flex w-13 shrink-0 flex-col self-start overflow-hidden rounded-md border bg-card text-center',
        due ? 'border-border' : 'border-dashed',
        className
      )}
    >
      <span
        className={cn(
          'h-4 font-medium text-[9.5px] leading-4 tracking-wide',
          due && !faded ? 'cohort-cover' : 'bg-muted text-muted-foreground',
          assessment.state === 'DRAFT' && due && 'opacity-70'
        )}
      >
        {due ? monthFormat.format(due).replace('.', '') : 'prazo'}
      </span>
      {due ? (
        <>
          <span
            className={cn(
              'pt-1.5 font-semibold text-[19px] leading-none tracking-[-0.04em]',
              faded ? 'text-muted-foreground' : 'text-foreground'
            )}
          >
            {due.getDate()}
          </span>
          <span className="pt-1 pb-1.5 text-[10px] text-muted-foreground tabular-nums leading-none">
            {timeFormat.format(due)}
          </span>
        </>
      ) : (
        <span className="py-2.5 text-[10px] text-muted-foreground leading-none">livre</span>
      )}
    </span>
  )
}
