import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'Informe seu login.'),
  password: z.string().min(1, 'Informe sua senha.'),
})

export type LoginValues = z.infer<typeof loginSchema>
