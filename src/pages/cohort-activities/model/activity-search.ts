import type { AssessmentState } from '@/shared/api/assessments'

export type ActivitySearch = {
  q?: string
  page?: number
  state?: AssessmentState
  /** Newest first by default; `due` puts the nearest deadline first. */
  order?: 'due'
}

export const STATE_FILTERS = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PUBLISHED', label: 'Publicadas' },
  { value: 'DRAFT', label: 'Rascunhos' },
  { value: 'ARCHIVED', label: 'Arquivadas' },
] as const

export const ORDERS = [
  { value: 'recent', label: 'Recentes' },
  { value: 'due', label: 'Por prazo' },
] as const
