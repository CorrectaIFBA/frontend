import { z } from 'zod'
import { isValidCpf, normalizeCpf } from '@/shared/lib/cpf'

export const cpfField = z
  .string()
  .refine((value) => normalizeCpf(value).length === 11, 'Informe os 11 dígitos do CPF.')
  .refine(isValidCpf, 'CPF inválido.')
