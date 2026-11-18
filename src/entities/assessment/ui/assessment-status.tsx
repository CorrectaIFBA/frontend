import { ASSESSMENT_STATE_LABEL, STATE_TONE } from '@/entities/assessment/config/assessment-state'
import type { AssessmentState } from '@/shared/api/assessments'
import { StatusPill } from '@/shared/ui/status-pill'

export function AssessmentStatus({ state }: { state: AssessmentState }) {
  return <StatusPill label={ASSESSMENT_STATE_LABEL[state]} tone={STATE_TONE[state]} />
}
