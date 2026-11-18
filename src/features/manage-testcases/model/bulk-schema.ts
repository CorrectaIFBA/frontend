import { z } from 'zod'
import { memoryField, timeField } from '@/features/manage-testcases/model/testcase-fields'
import { TESTCASE_TYPES } from '@/shared/api/assessments'

/* Each field starts at "keep": only what the teacher touches is sent. */
export const bulkSchema = z.object({
  type: z.enum(['KEEP', ...TESTCASE_TYPES]),
  timeLimitSeconds: z.union([z.literal(''), timeField]),
  memoryLimitMB: z.union([z.literal(''), memoryField]),
})

export type BulkValues = z.infer<typeof bulkSchema>
