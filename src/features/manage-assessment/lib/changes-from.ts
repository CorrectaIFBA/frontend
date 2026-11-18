import type { RulesValues } from '@/features/manage-assessment/model/assessment-schema'
import type { ParametersChange } from '@/shared/api/assessments'

/** Sends only what changed; clearing the time limit is sent as 0, the service's “none”. */
export function changesFrom(current: RulesValues, next: RulesValues): ParametersChange {
  const change: ParametersChange = {}
  if (next.timeLimit !== current.timeLimit) change.maximumTimeAllowed = next.timeLimit ? Number(next.timeLimit) : 0
  for (const key of [
    'showCompilationErrors',
    'canBeSubmittedAfterDueDate',
    'canViewDefinitiveTestcaseScoringAfterSubmission',
    'showTestcaseScoringOnlyAfterGrading',
    'showAssignedGrades',
  ] as const) {
    if (next[key] !== current[key]) change[key] = next[key]
  }
  return change
}
