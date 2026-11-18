import { LoaderCircle } from 'lucide-react'
import { gradeFormat } from '@/entities/grade'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { FormAlert } from '@/shared/ui/form-alert'

export type GradeChangeDialogProps = {
  /** Old and new maximum grade; `null` keeps the dialog closed. */
  pending: { from: number; to: number } | null
  isSaving: boolean
  error: string | null
  onConfirm: () => void
  onCancel: () => void
}

/*
  Before a question's maximum grade changes: the grades already given in it
  rescale by the same ratio, so each student keeps the same share of the
  question, and every activity grade is recalculated.
*/
export function GradeChangeDialog({ pending, isSaving, error, onConfirm, onCancel }: GradeChangeDialogProps) {
  const from = pending?.from ?? 0
  const to = pending?.to ?? 0
  // Half the old maximum, so the example shows the ratio, not only the full mark.
  const example = from / 2

  return (
    <Dialog onOpenChange={(open) => (open ? null : onCancel())} open={Boolean(pending)}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="font-semibold text-[15px]">
          Mudar o valor da questão de {gradeFormat.format(from)} para {gradeFormat.format(to)}?
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
          {from === 0
            ? 'As notas já dadas nesta questão são 0 e continuam 0.'
            : `As notas já dadas nesta questão mudam na mesma proporção: ${gradeFormat.format(example)} de ${gradeFormat.format(from)} passa a ${gradeFormat.format((example * to) / from)} de ${gradeFormat.format(to)}.`}{' '}
          A nota da atividade de cada estudante é recalculada, e cada ajuste fica no registro de notas.
        </DialogDescription>
        <FormAlert message={error} />
        <div className="flex justify-end gap-2">
          <Button disabled={isSaving} onClick={onCancel} type="button" variant="outline">
            Cancelar
          </Button>
          <Button disabled={isSaving} onClick={onConfirm} type="button">
            {isSaving ? <LoaderCircle className="animate-spin" /> : null}
            Mudar valor e salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
