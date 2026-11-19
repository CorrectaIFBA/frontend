import { AnimatePresence, motion } from 'framer-motion'
import { STATUS_INFO, TEXT_TONE } from '@/entities/evaluation/config/result-tones'
import type { PreviewTestCase } from '@/shared/api/evaluations'
import { cn } from '@/shared/lib/cn'

export function ResultChip({ result }: { result: PreviewTestCase }) {
  const { label, tone, icon: Icon } = STATUS_INFO[result.status]

  return (
    <span className="ml-auto inline-flex shrink-0 items-center overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={cn('inline-flex items-center gap-1 text-[11px]', TEXT_TONE[tone])}
          exit={{ opacity: 0, y: -6, scale: 0.9 }}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          key={result.status}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        >
          <Icon className={cn('size-3.5', result.status === 'RUNNING' && 'animate-spin motion-reduce:animate-none')} />
          {label}
          {result.executionTimeMs !== null && result.status !== 'RUNNING' ? (
            <span className="text-muted-foreground tabular-nums">· {result.executionTimeMs} ms</span>
          ) : null}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
