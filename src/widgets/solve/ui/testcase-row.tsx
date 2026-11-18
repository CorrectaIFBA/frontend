import { ChevronRight, EyeOff } from 'lucide-react'
import { ResultChip, ResultOutput, resultWash, RowFlash, RunningEdge } from '@/entities/evaluation'
import type { Testcase } from '@/shared/api/assessments'
import type { PreviewTestCase } from '@/shared/api/evaluations'
import { cn } from '@/shared/lib/cn'
import { canOpenCase } from '@/widgets/solve/model/use-open-cases'
import { IoBlock } from '@/widgets/solve/ui/io-block'
import { TestcaseTypeTag } from '@/widgets/solve/ui/testcase-type-tag'

export function TestcaseRow({
  testcase,
  index,
  result,
  isOpen,
  onToggle,
  showType = false,
  outputLabel,
}: {
  testcase: Testcase
  index: number
  result?: PreviewTestCase
  /** Expanded; the column keeps it, so its header can collapse every case. */
  isOpen: boolean
  onToggle: () => void
  /** Names the type on each row; for faculty, who see every type. */
  showType?: boolean
  /** Whose output the result shows; the student's own by default. */
  outputLabel?: string
}) {
  // The service leaves out the values a student may not see; faculty get them for every type.
  const isHidden = !canOpenCase(testcase)
  const typeTag = showType ? <TestcaseTypeTag type={testcase.type} /> : null

  if (isHidden) {
    return (
      <li className={cn('relative flex items-center gap-2 px-3 py-2 text-xs transition-colors', resultWash(result))}>
        <RowFlash result={result} />
        <RunningEdge result={result} />
        <EyeOff aria-label="Privado" className="size-3.5 text-muted-foreground" />
        <span className="font-medium">Caso {index + 1}</span>
        {result ? <ResultChip result={result} /> : null}
      </li>
    )
  }

  return (
    // The verdict tints the whole case, values included, so passed and failed read apart.
    <li className={cn('relative transition-colors', resultWash(result))}>
      <RowFlash result={result} />
      <RunningEdge result={result} />
      <button
        aria-expanded={isOpen}
        className="relative flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-accent/50"
        onClick={onToggle}
        type="button"
      >
        <ChevronRight className={cn('size-3.5 text-muted-foreground transition-transform', isOpen && 'rotate-90')} />
        <span className="font-medium">Caso {index + 1}</span>
        {result ? <ResultChip result={result} /> : null}
        {typeTag}
      </button>
      {isOpen ? (
        // Input and expected output side by side once the column is wide enough; the student's output below, full width.
        <div className="relative grid grid-cols-1 gap-2 px-3 pb-3 pl-8 @sm:grid-cols-2">
          <IoBlock label="Entrada" value={testcase.input ?? ''} />
          <IoBlock label="Saída esperada" value={testcase.expectedOutput ?? ''} />
          {result ? <ResultOutput label={outputLabel} result={result} /> : null}
        </div>
      ) : null}
    </li>
  )
}
