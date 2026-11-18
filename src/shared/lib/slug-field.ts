import { z } from 'zod'
import { SLUG_PATTERN } from '@/shared/api/cohorts'

/** A slug must be a valid URL piece; empty is left to the caller (generated or required). */
export const slugField = z
  .string()
  .trim()
  .max(160, 'Use no máximo 160 caracteres.')
  .refine((value) => !value || SLUG_PATTERN.test(value), 'Use letras minúsculas, números e hífens.')
