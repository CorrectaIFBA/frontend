import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert } from 'lucide-react'

export function FormAlert({ message }: { message: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          initial={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
        >
          <p
            className="flex gap-2 rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-destructive text-xs leading-relaxed"
            role="alert"
          >
            <CircleAlert className="mt-px size-3.5 shrink-0" />
            {message}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
