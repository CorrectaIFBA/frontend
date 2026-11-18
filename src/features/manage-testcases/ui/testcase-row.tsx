import { GripVertical, PencilLine, Trash2 } from 'lucide-react'
import type { DragEvent, KeyboardEvent } from 'react'
import { ROW_GRID } from '@/features/manage-testcases/config/row-grid'
import { TYPE_INFO } from '@/features/manage-testcases/config/testcase-types'
import { IoPair } from '@/features/manage-testcases/ui/io-pair'
import { SelectBox } from '@/features/manage-testcases/ui/select-box'
import { TestcaseDialog } from '@/features/manage-testcases/ui/testcase-dialog'
import { deleteTestcases, type Testcase } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

export function TestcaseRow({
  assessmentId,
  testcase,
  number,
  total,
  selected,
  dragging,
  draggable,
  handleRef,
  onToggle,
  onArm,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onHandleKey,
}: {
  assessmentId: string
  testcase: Testcase
  number: number
  total: number
  selected: boolean
  dragging: boolean
  draggable: boolean
  handleRef: (element: HTMLButtonElement | null) => void
  onToggle: () => void
  onArm: (on: boolean) => void
  onDragStart: (event: DragEvent) => void
  onDragOver: (event: DragEvent) => void
  onDrop: (event: DragEvent) => void
  onDragEnd: () => void
  onHandleKey: (event: KeyboardEvent) => void
}) {
  const info = TYPE_INFO[testcase.type]
  const TypeIcon = info.icon

  return (
    <li
      className={cn(
        'group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 px-4 py-3 transition-[background-color,opacity]',
        ROW_GRID,
        selected ? 'bg-(--cohort-ink)/6' : 'hover:bg-muted/30',
        dragging && 'opacity-40'
      )}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDrop={onDrop}
    >
      <div className="flex items-start gap-2 pt-0.5">
        <SelectBox checked={selected} label={`Selecionar caso ${number}`} onChange={onToggle} />
        <button
          aria-label={`Caso ${number} de ${total}. Arraste ou use as setas para mover.`}
          className="-my-0.5 flex h-5 w-4 cursor-grab items-center justify-center rounded-sm text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:text-foreground active:cursor-grabbing"
          onKeyDown={onHandleKey}
          onPointerDown={() => onArm(true)}
          onPointerUp={() => onArm(false)}
          ref={handleRef}
          type="button"
        >
          <GripVertical className="size-3.5" />
        </button>
        <span className="-mt-1 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 font-semibold text-(--cohort-ink) text-xs tabular-nums">
          {number}
        </span>
      </div>

      <IoPair input={testcase.input} output={testcase.expectedOutput} />

      <div className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs md:col-start-auto md:flex-col md:items-end">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px]',
              testcase.type === 'PUBLIC'
                ? 'border-(--cohort-ink)/40 text-(--cohort-ink)'
                : testcase.type === 'PRIVATE'
                  ? 'border-border text-muted-foreground'
                  : 'border-border border-dashed text-muted-foreground'
            )}
            title={info.hint}
          >
            <TypeIcon className="size-3" /> {info.label}
          </span>
          <div className="flex items-center gap-0.5">
            <TestcaseDialog
              assessmentId={assessmentId}
              number={number}
              questionId={testcase.questionId}
              testcase={testcase}
              trigger={
                <Button aria-label={`Editar caso ${number}`} size="icon-xs" variant="ghost-muted">
                  <PencilLine />
                </Button>
              }
            />
            <ConfirmDialog
              action={() => deleteTestcases(assessmentId, testcase.questionId, [testcase.id])}
              confirmLabel="Excluir"
              destructive
              notice={{ tone: 'irreversible' }}
              successMessage="Caso de teste excluído."
              title={`Excluir o caso ${number}?`}
              trigger={
                <Button aria-label={`Excluir caso ${number}`} size="icon-xs" variant="ghost-muted">
                  <Trash2 />
                </Button>
              }
            />
          </div>
        </div>
        <span className="tabular-nums">
          {testcase.timeLimitSeconds} s, {testcase.memoryLimitMB} MB
        </span>
      </div>
    </li>
  )
}
