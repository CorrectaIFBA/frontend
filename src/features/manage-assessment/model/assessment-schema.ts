import { z } from 'zod'
import { type AssessmentParameters, DEFAULT_PARAMETERS } from '@/shared/api/assessments'
import { slugField } from '@/shared/lib/slug-field'

export const detailsSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título da atividade.').max(255, 'Use no máximo 255 caracteres.'),
  slug: slugField,
  description: z.string().trim().max(1024, 'Use no máximo 1024 caracteres.'),
  dueDate: z.string().refine((value) => !value || !Number.isNaN(new Date(value).getTime()), 'Data inválida.'),
})

/** Empty means no limit; anything else is a whole number of minutes. */
export const timeLimitField = z
  .string()
  .trim()
  .refine((value) => !value || (/^\d+$/.test(value) && Number(value) >= 1), 'Use um número inteiro de minutos, 1 ou mais.')

export const rulesSchema = z.object({
  timeLimit: timeLimitField,
  showCompilationErrors: z.boolean(),
  canBeSubmittedAfterDueDate: z.boolean(),
  canViewDefinitiveTestcaseScoringAfterSubmission: z.boolean(),
  showTestcaseScoringOnlyAfterGrading: z.boolean(),
  showAssignedGrades: z.boolean(),
})

export type DetailsValues = z.infer<typeof detailsSchema>

export type RulesValues = z.infer<typeof rulesSchema>

export function rulesValues(parameters: AssessmentParameters | null): RulesValues {
  const current = parameters ?? DEFAULT_PARAMETERS
  return {
    timeLimit: current.maximumTimeAllowed ? String(current.maximumTimeAllowed) : '',
    showCompilationErrors: current.showCompilationErrors,
    canBeSubmittedAfterDueDate: current.canBeSubmittedAfterDueDate,
    canViewDefinitiveTestcaseScoringAfterSubmission: current.canViewDefinitiveTestcaseScoringAfterSubmission,
    showTestcaseScoringOnlyAfterGrading: current.showTestcaseScoringOnlyAfterGrading,
    showAssignedGrades: current.showAssignedGrades,
  }
}

export function toParameters(values: RulesValues): AssessmentParameters {
  return {
    maximumTimeAllowed: values.timeLimit ? Number(values.timeLimit) : null,
    showCompilationErrors: values.showCompilationErrors,
    canBeSubmittedAfterDueDate: values.canBeSubmittedAfterDueDate,
    canViewDefinitiveTestcaseScoringAfterSubmission: values.canViewDefinitiveTestcaseScoringAfterSubmission,
    showTestcaseScoringOnlyAfterGrading: values.showTestcaseScoringOnlyAfterGrading,
    showAssignedGrades: values.showAssignedGrades,
  }
}

export const createSchema = detailsSchema.extend(rulesSchema.shape)

export type CreateValues = z.infer<typeof createSchema>
