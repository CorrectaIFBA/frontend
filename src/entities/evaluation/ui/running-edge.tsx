import { motion } from 'framer-motion'
import type { PreviewTestCase } from '@/shared/api/evaluations'

/* The running case gets a moving bar on its left edge. */
export function RunningEdge({ result }: { result?: PreviewTestCase }) {
  if (result?.status !== 'RUNNING') return null
  return (
    <motion.span
      animate={{ opacity: [0.35, 1, 0.35] }}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-(--cohort-ink)"
      transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
    />
  )
}
