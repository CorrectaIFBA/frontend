import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { ApiError } from '@/shared/api/errors'

/**
 * Puts the service's per-field messages on the fields they belong to.
 * `aliases` maps a request path (e.g. `credential.login`) to a form field.
 * Returns whether any landed, so the caller can skip the generic alert.
 */
export function applyFieldErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown,
  aliases: Record<string, Path<T>> = {}
) {
  if (!(error instanceof ApiError)) return false

  let applied = false
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    const target = aliases[field] ?? (field in form.getValues() ? (field as Path<T>) : undefined)
    if (target) {
      form.setError(target, { message })
      applied = true
    }
  }
  return applied
}
