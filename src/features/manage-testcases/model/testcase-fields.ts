import { z } from 'zod'

/* The service's bounds, so the form refuses what the service would. */
export const timeField = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Use um número inteiro de segundos.')
  .refine((value) => Number(value) >= 1 && Number(value) <= 60, 'Use de 1 a 60 segundos.')

export const memoryField = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Use um número inteiro de MB.')
  .refine((value) => Number(value) >= 16 && Number(value) <= 1024, 'Use de 16 a 1024 MB.')

export const ioField = z.string().max(65535, 'Use no máximo 65535 caracteres.')
