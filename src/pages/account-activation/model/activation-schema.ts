import { z } from 'zod'

/* Mirrors CreatePasswordRequest on the identity service. */
export const MIN_LENGTH = 8

export const MAX_LENGTH = 128

export const activationSchema = z
  .object({
    password: z
      .string()
      .min(MIN_LENGTH, `Use pelo menos ${MIN_LENGTH} caracteres.`)
      .max(MAX_LENGTH, `Use no máximo ${MAX_LENGTH} caracteres.`),
    confirmPassword: z.string().min(1, 'Repita a senha.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })

export type ActivationValues = z.infer<typeof activationSchema>
