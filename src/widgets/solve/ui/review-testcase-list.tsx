import type { PreviewTestCase } from '@/shared/api/evaluations'
import { errorMessage } from '@/shared/api/errors'
import { Skeleton } from '@/shared/ui/skeleton'
import type { ReviewTestcasesState } from '@/widgets/solve/model/use-review-testcases'
import { TestcaseRow } from '@/widgets/solve/ui/testcase-row'

type ReviewTestcaseListProps = {
  column: ReviewTestcasesState
  showType: boolean
  /** Each case's verdict in the final evaluation; faculty only. */
  results: PreviewTestCase[] | null
}

export function ReviewTestcaseList({ column, showType, results }: ReviewTestcaseListProps) {
  const { query, cases, openCases } = column
  const resultsByTestcaseId = new Map(results?.map((result) => [result.testCaseId, result]))

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }
  if (query.isError) return <p className="p-3 text-muted-foreground text-xs">{errorMessage(query.error)}</p>
  if (!cases?.length) return <p className="p-3 text-muted-foreground text-xs">Esta questão não tem casos de teste visíveis.</p>

  return (
    <ol className="min-h-0 flex-1 divide-y divide-border/70 overflow-y-auto">
      {cases.map((testcase, index) => (
        <TestcaseRow
          index={index}
          isOpen={openCases.openIds.has(testcase.id)}
          key={testcase.id}
          onToggle={() => openCases.toggleCase(testcase.id)}
          outputLabel="Saída do estudante"
          result={resultsByTestcaseId.get(testcase.id)}
          showType={showType}
          testcase={testcase}
        />
      ))}
    </ol>
  )
}
