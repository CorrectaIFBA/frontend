import { motion } from 'framer-motion'
import type { PreviewTestCase } from '@/shared/api/evaluations'
import { cn } from '@/shared/lib/cn'

/*
  What the student's code printed for a public test case. Rendered as cells of
  the row's input/output grid, spanning its full width under the input and
  expected output.
*/
type ResultOutputProps = {
  result: PreviewTestCase
  /** Whose output it is; the student's own by default. */
  label?: string
}

export function ResultOutput({ result, label = 'Sua saída' }: ResultOutputProps) {
  if (result.actualOutput === null && result.errorMessage === null) return null
  return (
    <>
      {result.actualOutput !== null ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="col-span-full flex min-w-0 flex-col gap-1"
          initial={{ opacity: 0 }}
          key={`${result.testCaseId}:${result.status}`}
        >
          <span className="text-[11px] text-muted-foreground">{label}</span>
          <pre
            className={cn(
              'max-h-60 overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/40 px-2 py-1.5 font-mono text-[12px] leading-5 [overflow-wrap:anywhere]',
              result.status === 'PASSED' ? 'border-success/70' : result.status === 'WRONG_ANSWER' ? 'border-destructive/70' : 'border-border'
            )}
          >
            {result.actualOutput || <span className="text-muted-foreground">(vazia)</span>}
          </pre>
        </motion.div>
      ) : null}
      {result.errorMessage ? (
        <pre className="col-span-full max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-destructive/30 bg-destructive/8 px-2 py-1.5 font-mono text-[12px] text-destructive leading-5 [overflow-wrap:anywhere]">
          {result.errorMessage}
        </pre>
      ) : null}
    </>
  )
}
