import type { AssessmentState } from '@/shared/api/assessments'

export const ASSESSMENT_STATE_LABEL: Record<AssessmentState, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicada',
  ARCHIVED: 'Arquivada',
}

export const STATE_TONE: Record<AssessmentState, string> = {
  PUBLISHED: 'bg-success/10 text-success [--dot:var(--success)]',
  DRAFT: 'bg-warning/12 text-warning [--dot:var(--warning)]',
  ARCHIVED: 'bg-muted text-muted-foreground [--dot:var(--muted-foreground)]',
}
