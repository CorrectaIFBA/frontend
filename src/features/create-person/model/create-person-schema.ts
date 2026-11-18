import { z } from 'zod'
import { cpfField } from '@/entities/person'

export const createPersonSchema = z.object({
  documentNumber: cpfField,
  legalName: z.string().trim().min(1, 'Informe o nome civil.'),
  socialName: z.string().trim(),
})

export type CreatePersonValues = z.infer<typeof createPersonSchema>
