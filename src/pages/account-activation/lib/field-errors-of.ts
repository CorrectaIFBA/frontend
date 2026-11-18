import { ApiError } from '@/shared/api/errors'

export function fieldErrorsOf(error: unknown) {
  return error instanceof ApiError ? error.fieldErrors : {}
}
