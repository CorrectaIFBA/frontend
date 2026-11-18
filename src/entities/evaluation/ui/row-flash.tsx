import { motion } from 'framer-motion'
import { FILL_TONE, statusTone } from '@/entities/evaluation/config/result-tones'
import type { PreviewTestCase } from '@/shared/api/evaluations'
import { cn } from '@/shared/lib/cn'

/*
  A wash of the verdict's colour over the row, fading out, each time its
  status changes. Placed inside a `relative` row.
*/
export function RowFlash({ result }: { result?: PreviewTestCase }) {
  if (!result || result.status === 'PENDING') return null
  const tone = statusTone(result.status)
  return (
    <motion.span
      animate={{ opacity: 0 }}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', tone === 'muted' ? 'bg-foreground/6' : FILL_TONE[tone])}
      initial={{ opacity: tone === 'muted' ? 1 : 0.18 }}
      key={result.status}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />
  )
}
