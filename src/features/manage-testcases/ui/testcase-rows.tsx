import { useMutation } from '@tanstack/react-query'
import { type DragEvent, type KeyboardEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { move } from '@/features/manage-testcases/lib/move'
import { ColumnHeads } from '@/features/manage-testcases/ui/column-heads'
import { TestcaseRow } from '@/features/manage-testcases/ui/testcase-row'
import { reorderTestcases, type Testcase } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'

export function TestcaseRows({
  assessmentId,
  questionId,
  testcases,
  selected,
  onToggle,
}: {
  assessmentId: string
  questionId: string
  testcases: Testcase[]
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  // While dragging, the rows follow the pointer in this local order; the drop sends it.
  const [preview, setPreview] = useState<Testcase[] | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  // Rows only become draggable from the handle, so text in a row stays selectable.
  const [armed, setArmed] = useState<string | null>(null)
  const handles = useRef(new Map<string, HTMLButtonElement>())
  const rows = preview ?? testcases

  const reorder = useMutation({
    mutationFn: (ordered: Testcase[]) => reorderTestcases(assessmentId, questionId, ordered),
    onError: (error) => toast.error(errorMessage(error)),
  })

  const commit = (ordered: Testcase[]) => {
    const changed = ordered.some((testcase, index) => testcase.id !== testcases[index].id)
    if (changed) reorder.mutate(ordered)
  }

  const onDragOver = (event: DragEvent, overId: string) => {
    if (!dragging) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    if (overId === dragging) return
    const from = rows.findIndex((testcase) => testcase.id === dragging)
    const to = rows.findIndex((testcase) => testcase.id === overId)
    setPreview(move(rows, from, to))
  }

  const endDrag = (dropped: boolean) => {
    if (dropped && preview) commit(preview)
    setPreview(null)
    setDragging(null)
    setArmed(null)
  }

  // The handle has focus, so the arrows move only that row.
  const onHandleKey = (event: KeyboardEvent, index: number, id: string) => {
    const to = event.key === 'ArrowUp' ? index - 1 : event.key === 'ArrowDown' ? index + 1 : -1
    if (to < 0 || to >= rows.length) return
    event.preventDefault()
    commit(move(rows, index, to))
    requestAnimationFrame(() => handles.current.get(id)?.focus())
  }

  return (
    <>
      <ColumnHeads />
      <ol aria-busy={reorder.isPending} className="divide-y divide-border">
        {rows.map((testcase, index) => (
          <TestcaseRow
            assessmentId={assessmentId}
            dragging={dragging === testcase.id}
            draggable={armed === testcase.id && !reorder.isPending}
            handleRef={(element) => {
              if (element) handles.current.set(testcase.id, element)
              else handles.current.delete(testcase.id)
            }}
            key={testcase.id}
            number={index + 1}
            onArm={(on) => setArmed(on ? testcase.id : null)}
            onDragEnd={() => endDrag(false)}
            onDragOver={(event) => onDragOver(event, testcase.id)}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = 'move'
              event.dataTransfer.setData('text/plain', testcase.id)
              setDragging(testcase.id)
            }}
            onDrop={(event) => {
              event.preventDefault()
              endDrag(true)
            }}
            onHandleKey={(event) => onHandleKey(event, index, testcase.id)}
            onToggle={() => onToggle(testcase.id)}
            selected={selected.has(testcase.id)}
            testcase={testcase}
            total={rows.length}
          />
        ))}
      </ol>
    </>
  )
}
