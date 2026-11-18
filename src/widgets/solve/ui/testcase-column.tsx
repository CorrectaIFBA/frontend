import { MotionConfig } from 'framer-motion'
import type { CSSProperties } from 'react'
import { CompilationErrorPanel, PreviewSummary } from '@/entities/evaluation'
import { RunStatus } from '@/features/run-code'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'
import { useTestcaseColumn } from '@/widgets/solve/model/use-testcase-column'
import { ColumnResizeHandle } from '@/widgets/solve/ui/column-resize-handle'
import { FoldedTestcaseColumn } from '@/widgets/solve/ui/folded-testcase-column'
import { TestcaseColumnHeader } from '@/widgets/solve/ui/testcase-column-header'
import { TestcaseList } from '@/widgets/solve/ui/testcase-list'

type TestcaseColumnProps = {
  question: AssessmentQuestion
}

/*
  The test cases the student may know about, in a column right of the editor.
  Public ones are folded: the student opens one to compare its input and
  expected output with what their code printed. Private ones show only their
  number and verdict, and evaluation cases never reach the student.
*/
export function TestcaseColumn({ question }: TestcaseColumnProps) {
  const column = useTestcaseColumn(question)
  const { assessment, syncer, preview, execution, isOpen, markUsed } = column

  return (
    <MotionConfig reducedMotion="user">
      {isOpen ? (
        <ColumnResizeHandle
          onResize={column.setWidth}
          onResizeEnd={column.endResize}
          onResizeStart={column.startResize}
          width={column.width}
        />
      ) : null}
      <aside
        aria-label="Casos de teste"
        className={cn(
          '@container flex shrink-0 flex-col overflow-hidden border-border border-t bg-card ease-out motion-reduce:transition-none md:border-t-0 md:border-l',
          !column.isResizing && 'transition-[width] duration-300',
          isOpen ? 'max-h-[55svh] md:max-h-none md:w-(--testcases-width)' : 'md:w-10'
        )}
        style={{ '--testcases-width': `${column.width}px` } as CSSProperties}
        onFocusCapture={markUsed}
        onKeyDown={markUsed}
        onPointerDown={markUsed}
        onWheel={markUsed}
      >
        {isOpen ? (
          <>
            <TestcaseColumnHeader
              count={column.query.data ? column.visibleCases.length : undefined}
              onFold={column.toggleOpen}
              openCases={column.openCases}
            />
            <CompilationErrorPanel execution={execution} showDetails={assessment.parameters?.showCompilationErrors ?? true} />
            <TestcaseList column={column} />
            {syncer ? <RunStatus preview={execution} syncer={syncer} /> : null}
            <PreviewSummary connection={preview.connection} execution={execution} />
          </>
        ) : (
          <FoldedTestcaseColumn compileFailed={column.compileFailed} execution={execution} onOpen={column.toggleOpen} />
        )}
      </aside>
    </MotionConfig>
  )
}
