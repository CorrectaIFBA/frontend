import { motion } from 'framer-motion'
import { FILL_TONE, STATUS_INFO, statusTone } from '@/entities/evaluation/config/result-tones'
import type { PreviewExecution } from '@/shared/api/evaluations'
import { cn } from '@/shared/lib/cn'

/* One dot per case, for the folded column: the run can be followed without opening it. */
export function ResultDots({ execution, vertical }: { execution: PreviewExecution | null; vertical?: boolean }) {
  if (!execution || execution.testCases.length === 0) return null

  return (
    <span className={cn('flex flex-wrap items-center justify-center gap-1', vertical && 'flex-col')}>
      {execution.testCases.map((testCase) => (
        <motion.span
          animate={{ scale: testCase.status === 'RUNNING' ? [1, 1.4, 1] : 1 }}
          className={cn(
            'size-1.5 rounded-full transition-colors duration-500',
            testCase.status === 'PENDING' || testCase.status === 'SKIPPED'
              ? 'bg-transparent ring-1 ring-border-strong ring-inset'
              : FILL_TONE[statusTone(testCase.status)]
          )}
          key={testCase.testCaseId}
          title={STATUS_INFO[testCase.status].label}
          transition={testCase.status === 'RUNNING' ? { duration: 0.9, repeat: Number.POSITIVE_INFINITY } : { duration: 0.3 }}
        />
      ))}
    </span>
  )
}
