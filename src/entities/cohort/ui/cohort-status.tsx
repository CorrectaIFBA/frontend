import { COHORT_STATE_LABEL } from '@/entities/cohort/config/cohort-labels'
import { STATE_TONE } from '@/entities/cohort/config/cohort-tones'
import type { CohortState } from '@/shared/api/cohorts'
import { StatusPill } from '@/shared/ui/status-pill'

export function CohortStatus({ state }: { state: CohortState }) {
  return <StatusPill label={COHORT_STATE_LABEL[state]} tone={STATE_TONE[state]} />
}
