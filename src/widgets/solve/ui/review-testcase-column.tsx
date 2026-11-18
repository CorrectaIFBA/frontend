import type { CSSProperties } from 'react'
import { CompilationErrorPanel } from '@/entities/evaluation'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { QuestionGrade } from '@/shared/api/grades'
import { cn } from '@/shared/lib/cn'
import type { QuestionResult } from '@/widgets/solve/lib/attempt-result'
import { useReviewTestcases } from '@/widgets/solve/model/use-review-testcases'
import { ColumnResizeHandle } from '@/widgets/solve/ui/column-resize-handle'
import { FoldedTestcaseColumn } from '@/widgets/solve/ui/folded-testcase-column'
import { QuestionGradeSummary } from '@/widgets/solve/ui/question-grade-summary'
import { QuestionResultSummary } from '@/widgets/solve/ui/question-result-summary'
import { ReviewTestcaseList } from '@/widgets/solve/ui/review-testcase-list'
import { TestcaseColumnHeader } from '@/widgets/solve/ui/testcase-column-header'

type ReviewTestcaseColumnProps = {
  assessmentId: string
  question: AssessmentQuestion
  /** Faculty: every type, with inputs and expected outputs. */
  showsEveryType: boolean
  /** The question's final evaluation; `undefined` while it loads. */
  entry: QuestionResult | undefined
  /** The question's grade; `null` hides the grade, `undefined` says there is none yet. */
  grade: QuestionGrade | null | undefined
}

/*
  The test cases column of the coding page, with the final evaluation in
  place of runs. Faculty get the compiler's output and each case's verdict;
  students only the percentage at the foot.
*/
export function ReviewTestcaseColumn({ assessmentId, question, showsEveryType, entry, grade }: ReviewTestcaseColumnProps) {
  const column = useReviewTestcases(assessmentId, question, showsEveryType)
  const result = entry?.kind === 'evaluated' ? entry.result : null
  const compileFailed = result?.compilationSucceeded === false

  return (
    <>
      {column.isOpen ? (
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
          column.isOpen ? 'max-h-[55svh] md:max-h-none md:w-(--testcases-width)' : 'md:w-10'
        )}
        style={{ '--testcases-width': `${column.width}px` } as CSSProperties}
      >
        {column.isOpen ? (
          <>
            <TestcaseColumnHeader
              count={column.cases?.length}
              onFold={column.toggleOpen}
              openCases={column.openCases}
            />
            {/* Only faculty get the compilation outcome, so students never see this panel. */}
            {result ? <CompilationErrorPanel execution={{ ...result, id: result.evaluationId }} showDetails /> : null}
            <ReviewTestcaseList column={column} results={result?.testCases ?? null} showType={showsEveryType} />
            <QuestionResultSummary entry={entry} />
            {grade !== null ? <QuestionGradeSummary grade={grade} maximumGrade={Number(question.maximumGrade)} /> : null}
          </>
        ) : (
          <FoldedTestcaseColumn compileFailed={compileFailed} execution={null} onOpen={column.toggleOpen} />
        )}
      </aside>
    </>
  )
}
