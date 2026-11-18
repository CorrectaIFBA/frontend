import { AnimatePresence, motion } from 'framer-motion'
import { LoaderCircle, WifiOff } from 'lucide-react'
import type { PreviewConnection } from '@/entities/evaluation/model/use-preview-execution'
import { isPreviewDone, type PreviewExecution } from '@/shared/api/evaluations'
import { cn } from '@/shared/lib/cn'

/*
  The run as a whole, at the foot of the test cases: a progress bar and a
  line that says where it stands, or the score when it ends.
*/
export function PreviewSummary({ execution, connection }: { execution: PreviewExecution | null; connection: PreviewConnection }) {
  if (connection === 'reconnecting') {
    return (
      <p className="flex items-center gap-2 border-border border-t px-3 py-2 text-[12px] text-muted-foreground">
        <WifiOff className="size-3.5 shrink-0" /> Reconectando aos resultados…
      </p>
    )
  }
  if (!execution) return null

  const total = execution.testCases.length
  const passed = execution.testCases.filter((testCase) => testCase.status === 'PASSED').length
  const finished = execution.testCases.filter((testCase) => !['PENDING', 'RUNNING'].includes(testCase.status)).length
  const done = isPreviewDone(execution.status)
  const compileFailed = execution.compilationSucceeded === false
  const bad = compileFailed || execution.status === 'FAILED'

  const text = compileFailed
    ? 'O código não compilou.'
    : execution.status === 'QUEUED'
      ? 'Na fila para execução…'
      : execution.status === 'RUNNING'
        ? execution.compilationSucceeded === null
          ? 'Compilando…'
          : `Executando: ${finished} de ${total} casos`
        : execution.status === 'FAILED'
          ? 'Não foi possível concluir a execução.'
          : execution.status === 'CANCELLED'
            ? 'Execução cancelada.'
            : `${passed} de ${total} ${total === 1 ? 'caso passou' : 'casos passaram'}`

  const progress = compileFailed || (done && execution.status !== 'CANCELLED') ? 1 : total === 0 ? 0 : finished / total

  return (
    <div aria-live="polite" className="flex shrink-0 flex-col gap-1.5 border-border border-t px-3 py-2 text-[12px] leading-relaxed">
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          animate={{ width: `${Math.max(progress, done ? 1 : 0.04) * 100}%` }}
          className={cn(
            'h-full rounded-full',
            bad ? 'bg-destructive' : done && passed === total && total > 0 ? 'bg-success' : done ? 'bg-warning' : 'bg-(--cohort-ink)'
          )}
          initial={false}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>
      <p className={cn('flex items-center gap-2', bad ? 'text-destructive' : done && passed === total ? 'text-success' : 'text-muted-foreground')}>
        {!done ? <LoaderCircle className="size-3.5 shrink-0 animate-spin motion-reduce:animate-none" /> : null}
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: 4 }}
            key={text}
            transition={{ duration: 0.15 }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
        <span className="ml-auto text-muted-foreground tabular-nums">Revisão {execution.revision}</span>
      </p>
      {execution.status === 'FAILED' && execution.errorMessage ? <p className="text-muted-foreground">{execution.errorMessage}</p> : null}
    </div>
  )
}
