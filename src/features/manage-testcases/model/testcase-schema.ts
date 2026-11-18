import { z } from 'zod'
import { DEFAULT_LIMITS } from '@/features/manage-testcases/config/testcase-types'
import { ioField, memoryField, timeField } from '@/features/manage-testcases/model/testcase-fields'
import { type Testcase, TESTCASE_TYPES } from '@/shared/api/assessments'

/* ---------------------------------------------------------------------------
   One test case: add or edit
--------------------------------------------------------------------------- */

export const testcaseSchema = z.object({
  input: ioField,
  expectedOutput: ioField,
  type: z.enum(TESTCASE_TYPES),
  timeLimitSeconds: timeField,
  memoryLimitMB: memoryField,
})

export type TestcaseValues = z.infer<typeof testcaseSchema>

export function testcaseValues(testcase?: Testcase): TestcaseValues {
  return {
    input: testcase?.input ?? '',
    expectedOutput: testcase?.expectedOutput ?? '',
    type: testcase?.type ?? 'PUBLIC',
    timeLimitSeconds: String(testcase?.timeLimitSeconds ?? DEFAULT_LIMITS.timeLimitSeconds),
    memoryLimitMB: String(testcase?.memoryLimitMB ?? DEFAULT_LIMITS.memoryLimitMB),
  }
}
