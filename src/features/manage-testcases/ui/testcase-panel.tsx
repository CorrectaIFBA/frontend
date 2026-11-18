import { useQuery } from '@tanstack/react-query'
import { FlaskConical, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ImportDialog } from '@/features/manage-testcases/ui/import-dialog'
import { SelectionBar } from '@/features/manage-testcases/ui/selection-bar'
import { TestcaseDialog } from '@/features/manage-testcases/ui/testcase-dialog'
import { TestcaseRows } from '@/features/manage-testcases/ui/testcase-rows'
import { TypeSummary } from '@/features/manage-testcases/ui/type-summary'
import { testcasesQueryOptions } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'
import { Skeleton } from '@/shared/ui/skeleton'

/*
  The test cases of one question, in the order they run. Faculty pick rows
  to change or remove together, and drag a row by its handle (or move it
  with the arrow keys) to change the order.
*/
export function TestcasePanel({ assessmentId, questionId }: { assessmentId: string; questionId: string }) {
  const query = useQuery(testcasesQueryOptions(assessmentId, questionId))
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const testcases = query.data ?? []

  // Rows removed elsewhere drop out of the selection.
  useEffect(() => {
    if (!query.data) return
    setSelected((current) => {
      const ids = new Set(query.data.map((testcase) => testcase.id))
      const kept = [...current].filter((id) => ids.has(id))
      return kept.length === current.size ? current : new Set(kept)
    })
  }, [query.data])

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const allSelected = testcases.length > 0 && selected.size === testcases.length
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(testcases.map((testcase) => testcase.id)))

  const heading = (
    <PanelHeading
      action={
        <div className="flex items-center gap-2">
          {testcases.length ? <TypeSummary testcases={testcases} /> : null}
          <ImportDialog assessmentId={assessmentId} existing={testcases.length} questionId={questionId} />
          <TestcaseDialog
            assessmentId={assessmentId}
            questionId={questionId}
            trigger={
              <Button size="xs" variant="outline">
                <Plus /> Adicionar caso
              </Button>
            }
          />
        </div>
      }
      title="Casos de teste"
    />
  )

  if (query.isError) {
    return (
      <Panel>
        {heading}
        <div className="p-4">
          <PanelNote>{errorMessage(query.error)}</PanelNote>
        </div>
      </Panel>
    )
  }

  if (query.isPending) {
    return (
      <Panel>
        {heading}
        <div className="flex flex-col gap-3 p-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      {heading}
      {testcases.length ? (
        <>
          <SelectionBar
            allSelected={allSelected}
            assessmentId={assessmentId}
            onClear={() => setSelected(new Set())}
            onToggleAll={toggleAll}
            questionId={questionId}
            selected={testcases.filter((testcase) => selected.has(testcase.id))}
            total={testcases.length}
          />
          <TestcaseRows
            assessmentId={assessmentId}
            onToggle={toggle}
            questionId={questionId}
            selected={selected}
            testcases={testcases}
          />
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <FlaskConical className="size-5 text-muted-foreground" />
          <p className="font-medium text-sm">Nenhum caso de teste</p>
          <p className="max-w-sm text-muted-foreground text-xs leading-relaxed">
            Adicione casos um por vez ou importe um arquivo de entradas e outro de saídas, uma por linha.
          </p>
        </div>
      )}
    </Panel>
  )
}
