import { z } from 'zod'

export const editPersonSchema = z.object({
  legalName: z.string().trim().min(1, 'Informe o nome civil.'),
  socialName: z.string().trim(),
})

export type EditPersonValues = z.infer<typeof editPersonSchema>
