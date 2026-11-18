import { ListChecks, XCircle } from 'lucide-react'
import { ResultDots } from '@/entities/evaluation'
import type { PreviewExecution } from '@/shared/api/evaluations'

type FoldedTestcaseColumnProps = {
  execution: PreviewExecution | null
  compileFailed: boolean
  onOpen: () => void
}

export function FoldedTestcaseColumn({ execution, compileFailed, onOpen }: FoldedTestcaseColumnProps) {
  return (
    <button
      aria-label="Mostrar casos de teste"
      className="flex h-9 w-full items-center gap-2 px-3 text-left text-muted-foreground text-xs transition-colors hover:bg-accent/50 hover:text-foreground md:h-full md:flex-col md:px-0 md:py-3"
      onClick={onOpen}
      title="Mostrar casos de teste"
      type="button"
    >
      <ListChecks className="size-4 shrink-0" />
      <span className="font-medium md:[writing-mode:vertical-rl]">Casos de teste</span>
      <span className="ml-auto md:ml-0 md:mt-2">
        {compileFailed ? (
          <XCircle aria-label="Erro de compilação" className="size-4 text-destructive" />
        ) : (
          <ResultDots execution={execution} vertical />
        )}
      </span>
    </button>
  )
}
