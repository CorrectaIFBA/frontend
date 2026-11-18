import { type Assessment, DEFAULT_PARAMETERS } from '@/shared/api/assessments'

/** Whether the student sees the test case percentage once the attempt ended. */
export const showsScore = (assessment: Pick<Assessment, 'parameters'>) =>
  (assessment.parameters ?? DEFAULT_PARAMETERS).canViewDefinitiveTestcaseScoringAfterSubmission
