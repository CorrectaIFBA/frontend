import { Trash2, X } from 'lucide-react'
import { BulkEditDialog } from '@/features/manage-testcases/ui/bulk-edit-dialog'
import { SelectBox } from '@/features/manage-testcases/ui/select-box'
import { deleteTestcases, type Testcase } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

export function SelectionBar({
  assessmentId,
  questionId,
  selected,
  total,
  allSelected,
  onToggleAll,
  onClear,
}: {
  assessmentId: string
  questionId: string
  selected: Testcase[]
  total: number
  allSelected: boolean
  onToggleAll: () => void
  onClear: () => void
}) {
  const count = selected.length
  const ids = selected.map((testcase) => testcase.id)

  return (
    <div
      className={cn(
        'flex min-h-10 flex-wrap items-center gap-x-3 gap-y-2 border-border border-b px-4 py-1.5 text-xs transition-colors',
        count ? 'bg-(--cohort-ink)/8' : 'bg-muted/40'
      )}
    >
      <SelectBox
        checked={allSelected}
        label={allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
        mixed={count > 0 && !allSelected}
        onChange={onToggleAll}
      />
      {count ? (
        <>
          <span aria-live="polite" className="font-medium tabular-nums">
            {count} de {total} {count === 1 ? 'selecionado' : 'selecionados'}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <BulkEditDialog assessmentId={assessmentId} ids={ids} onDone={onClear} questionId={questionId} />
            <ConfirmDialog
              action={async () => {
                await deleteTestcases(assessmentId, questionId, ids)
                onClear()
              }}
              confirmLabel={count === 1 ? 'Excluir caso' : `Excluir ${count} casos`}
              description="A entrada e a saída esperada são apagadas."
              destructive
              notice={{ tone: 'irreversible' }}
              successMessage={count === 1 ? 'Caso de teste excluído.' : `${count} casos de teste excluídos.`}
              title={count === 1 ? 'Excluir o caso selecionado?' : `Excluir ${count} casos de teste?`}
              trigger={
                <Button size="xs" variant="destructive-outline">
                  <Trash2 /> Excluir
                </Button>
              }
            />
            <Button aria-label="Limpar seleção" onClick={onClear} size="icon-xs" variant="ghost-muted">
              <X />
            </Button>
          </div>
        </>
      ) : (
        <span className="text-muted-foreground">
          Selecione casos para editar em lote. Arraste pela alça para reordenar.
        </span>
      )}
    </div>
  )
}
