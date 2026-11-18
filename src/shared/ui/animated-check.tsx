import { motion } from 'framer-motion'

/** Draws itself in: the same verdict the judge panel ends on. */
export function AnimatedCheck() {
  return (
    <span className="flex size-12 items-center justify-center rounded-xl bg-success/12 text-success">
      <svg aria-hidden className="size-7" fill="none" viewBox="0 0 24 24">
        <motion.path
          animate={{ pathLength: 1 }}
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={{ pathLength: 0 }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        />
      </svg>
    </span>
  )
}
