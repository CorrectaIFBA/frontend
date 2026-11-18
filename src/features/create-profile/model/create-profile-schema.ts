import { z } from 'zod'
import { cpfField } from '@/entities/person'

export const createProfileSchema = z.object({
  type: z.enum(['STUDENT', 'FACULTY', 'STAFF']),
  documentNumber: cpfField,
  legalName: z.string().trim(),
  socialName: z.string().trim(),
  email: z.string().trim().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
  login: z.string().trim().min(1, 'Informe o login.'),
})

export type CreateProfileValues = z.infer<typeof createProfileSchema>
