import { statusTone, WASH_TONE } from '@/entities/evaluation/config/result-tones'
import type { PreviewTestCase } from '@/shared/api/evaluations'

/** Background class for a test case with [result]; none before it has a verdict. */
export const resultWash = (result: PreviewTestCase | undefined) => (result ? WASH_TONE[statusTone(result.status)] : '')
