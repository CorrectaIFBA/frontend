import { z } from 'zod'
import { memoryField, timeField } from '@/features/manage-testcases/model/testcase-fields'
import { TESTCASE_TYPES } from '@/shared/api/assessments'

/* ---------------------------------------------------------------------------
   Import: one file of inputs, one of outputs, matched line by line
--------------------------------------------------------------------------- */

export const importSchema = z.object({
  type: z.enum(TESTCASE_TYPES),
  timeLimitSeconds: timeField,
  memoryLimitMB: memoryField,
})

export type ImportValues = z.infer<typeof importSchema>
