import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, X } from 'lucide-react'
import type { PreviewExecution } from '@/shared/api/evaluations'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'

/*
  The compiler's output when the code did not compile: the first thing in the
  column, tall enough to read, and openable at full size. In the narrow column
  long lines wrap; the full-size dialog keeps them whole, so the compiler's
  caret markers line up there.
*/
type CompilationErrorPanelProps = {
  /** A run, or a final evaluation shaped like one. */
  execution: Pick<PreviewExecution, 'id' | 'revision' | 'compilationSucceeded' | 'compilationMessage'> | null
  showDetails: boolean
}

export function CompilationErrorPanel({ execution, showDetails }: CompilationErrorPanelProps) {
  const failed = execution?.compilationSucceeded === false
  const output = execution?.compilationMessage?.trim() ?? ''

  return (
    <AnimatePresence initial={false}>
      {failed ? (
        <motion.section
          animate={{ opacity: 1, height: 'auto' }}
          aria-label="Erro de compilação"
          className="shrink-0 overflow-hidden border-destructive/30 border-b bg-destructive/6"
          exit={{ opacity: 0, height: 0 }}
          initial={{ opacity: 0, height: 0 }}
          key={execution?.id}
          role="alert"
        >
          <div className="flex items-center gap-2 px-3 pt-3 pb-2">
            <X className="size-4 shrink-0 text-destructive" />
            <h3 className="font-semibold text-[13px] text-destructive">Erro de compilação</h3>
            <span className="text-muted-foreground text-xs tabular-nums">Revisão {execution?.revision}</span>
            {showDetails && output ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button aria-label="Ver em tela cheia" className="ml-auto" size="icon-xs" title="Ver em tela cheia" variant="ghost-muted">
                    <Maximize2 />
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[85svh] flex-col gap-3 sm:max-w-4xl">
                  <DialogTitle className="font-semibold text-[15px]">Erro de compilação</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-xs">
                    Saída do compilador para a revisão {execution?.revision}.
                  </DialogDescription>
                  <pre className="min-h-0 flex-1 overflow-auto rounded-md border border-destructive/30 bg-muted/40 p-3 font-mono text-[13px] leading-6">
                    {output}
                  </pre>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
          {showDetails ? (
            output ? (
              <pre className="mx-3 mb-3 max-h-[45svh] min-h-24 overflow-y-auto whitespace-pre-wrap rounded-md border border-destructive/30 bg-background px-2.5 py-2 font-mono text-[11px] leading-[1.55] [overflow-wrap:anywhere]">
                {output}
              </pre>
            ) : (
              <p className="px-3 pb-3 text-[13px] text-muted-foreground">Não foram fornecidos detalhes acerca do estado da compilação.</p>
            )
          ) : (
            <p className="px-3 pb-3 text-[13px] text-muted-foreground">
              Falha na compilação.
            </p>
          )}
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}
