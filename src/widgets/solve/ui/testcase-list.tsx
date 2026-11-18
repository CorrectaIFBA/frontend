import { errorMessage } from '@/shared/api/errors'
import { Skeleton } from '@/shared/ui/skeleton'
import type { TestcaseColumnState } from '@/widgets/solve/model/use-testcase-column'
import { TestcaseRow } from '@/widgets/solve/ui/testcase-row'

type TestcaseListProps = {
  column: TestcaseColumnState
}

export function TestcaseList({ column }: TestcaseListProps) {
  const { query, visibleCases, resultsByCaseId, openCases } = column

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {query.isPending ? (
        <div className="flex flex-col gap-2 p-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : query.isError ? (
        <p className="p-3 text-muted-foreground text-xs">{errorMessage(query.error)}</p>
      ) : visibleCases.length === 0 ? (
        <p className="p-3 text-muted-foreground text-xs">Esta questão não tem casos de teste visíveis.</p>
      ) : (
        <ol className="divide-y divide-border/70">
          {visibleCases.map((testcase, index) => (
            <TestcaseRow
              index={index}
              isOpen={openCases.openIds.has(testcase.id)}
              key={testcase.id}
              onToggle={() => openCases.toggleCase(testcase.id)}
              result={resultsByCaseId.get(testcase.id)}
              testcase={testcase}
            />
          ))}
        </ol>
      )}
    </div>
  )
}
