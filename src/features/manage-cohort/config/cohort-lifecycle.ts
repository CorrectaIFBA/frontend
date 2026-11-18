import type { CohortState } from '@/shared/api/cohorts'

/* ---------------------------------------------------------------------------
   Status: the cohort's lifecycle is a real sequence, so it is drawn as one.
--------------------------------------------------------------------------- */

export const STATE_MEANING: Record<CohortState, string> = {
  DRAFT: 'Só você vê a turma. Ninguém entra enquanto ela é um rascunho.',
  ACTIVE: 'Estudantes e docentes entram por código ou convite e acessam a turma.',
  ARCHIVED: 'Somente leitura. Ninguém entra, e códigos e convites não funcionam.',
}

export const LIFECYCLE: CohortState[] = ['DRAFT', 'ACTIVE', 'ARCHIVED']
