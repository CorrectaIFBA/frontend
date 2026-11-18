import type { AssessmentState } from '@/shared/api/assessments'

/* ---------------------------------------------------------------------------
   Status: drafted, then published, then archived. An archived activity can
   be published again, so the last step is not a dead end.
--------------------------------------------------------------------------- */

export const STATE_MEANING: Record<AssessmentState, string> = {
  DRAFT: 'Só os docentes veem a atividade.',
  PUBLISHED: 'Os estudantes da turma veem a atividade e podem entregá-la.',
  ARCHIVED: 'Os estudantes deixam de ver a atividade.',
}

export const LIFECYCLE: AssessmentState[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
