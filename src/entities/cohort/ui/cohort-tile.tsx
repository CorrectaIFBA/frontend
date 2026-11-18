import { cohortMonogram } from '@/entities/cohort/lib/cohort-monogram'
import { cohortTint } from '@/entities/cohort/lib/cohort-tint'
import type { Cohort } from '@/shared/api/cohorts'
import { cn } from '@/shared/lib/cn'

/** The cohort's monogram on its cover colour, as a square tile. */
export function CohortTile({
  cohort,
  className,
}: {
  cohort: Pick<Cohort, 'id' | 'name' | 'status'>
  className?: string
}) {
  return (
    <span
      {...cohortTint(cohort)}
      aria-hidden
      className={cn(
        'cohort-cover flex shrink-0 items-center justify-center rounded-lg font-semibold tracking-[-0.04em]',
        className
      )}
    >
      {cohortMonogram(cohort.name)}
    </span>
  )
}
