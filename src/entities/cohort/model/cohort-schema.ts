import { z } from 'zod'
import { slugField } from '@/shared/lib/slug-field'

export const cohortSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da turma.').max(255, 'Use no máximo 255 caracteres.'),
  slug: slugField,
  description: z.string().trim().max(1024, 'Use no máximo 1024 caracteres.'),
})

export type CohortValues = z.infer<typeof cohortSchema>
