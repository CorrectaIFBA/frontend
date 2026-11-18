import { Link } from '@tanstack/react-router'
import { cohortMonogram, cohortTint, CohortStatus } from '@/entities/cohort'
import { type Cohort, cohortAddress } from '@/shared/api/cohorts'
import { cn } from '@/shared/lib/cn'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'

/*
  A cohort as a notebook cover: its colour band and monogram on top, then
  the name. Drafts get a dashed edge, the same way a sketch is drawn.
*/
export function CohortCard({ cohort, owned }: { cohort: Cohort; owned: boolean }) {
  return (
    <Link
      {...cohortTint(cohort)}
      className={cn(
        'group flex min-h-60 flex-col overflow-hidden rounded-lg border bg-card transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[0_2px_10px_-4px_oklch(0_0_0/0.12)]',
        cohort.status === 'DRAFT' && 'border-dashed border-border-strong'
      )}
      params={{ cohortRef: cohortAddress(cohort) }}
      to="/classes/$cohortRef"
    >
      <div className="cohort-cover relative flex h-24 items-end justify-between gap-3 px-4 pb-3">
        <span aria-hidden className="font-semibold text-[34px] leading-none tracking-[-0.05em]">
          {cohortMonogram(cohort.name)}
        </span>
        <span className="mb-0.5 max-w-[60%] truncate font-mono text-[11px] opacity-75">/{cohort.slug}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3.5 pb-4">
        <h2 className="line-clamp-2 font-semibold text-[15px] leading-snug tracking-[-0.015em] group-hover:text-(--cohort-ink)">
          {cohort.name}
        </h2>
        <p className={cn('line-clamp-2 text-xs leading-relaxed', cohort.description ? 'text-muted-foreground' : 'text-muted-foreground/60')}>
          {cohort.description || 'Sem descrição.'}
        </p>
      </div>
      <div className="flex items-center gap-2 border-border/70 border-t px-4 py-2.5">
        <CohortStatus state={cohort.status} />
        {owned ? <span className="text-muted-foreground text-xs">Criada por você</span> : null}
        <time
          className="ml-auto text-muted-foreground text-xs"
          dateTime={cohort.createdAt}
          title={dateTimeFormat.format(new Date(cohort.createdAt))}
        >
          {relativeDate(cohort.createdAt)}
        </time>
      </div>
    </Link>
  )
}
