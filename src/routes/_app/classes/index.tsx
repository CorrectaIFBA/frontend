import { createFileRoute } from '@tanstack/react-router'
import { type CohortListSearch, pickDay, CohortsPage } from '@/pages/cohorts'
import { COHORT_SORT_FIELDS, COHORT_STATES } from '@/shared/api/cohorts'
import { parseListSearch, pickEnum } from '@/shared/lib/list-search'

export const Route = createFileRoute('/_app/classes/')({
  head: () => ({ meta: [{ title: 'Turmas · Correcta' }] }),
  validateSearch: (raw: Record<string, unknown>): CohortListSearch => ({
    ...parseListSearch(raw, COHORT_SORT_FIELDS),
    status: pickEnum(raw.status, COHORT_STATES),
    mine: raw.mine === true || raw.mine === 'true' ? true : undefined,
    from: pickDay(raw.from),
    to: pickDay(raw.to),
  }),
  component: CohortsPage,
})
