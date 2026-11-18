import { FileUp, LoaderCircle } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { useTestcaseImport } from '@/features/manage-testcases/model/use-testcase-import'
import { ImportFileSlot } from '@/features/manage-testcases/ui/import-file-slot'
import { ImportPreview } from '@/features/manage-testcases/ui/import-preview'
import { LimitFields } from '@/features/manage-testcases/ui/limit-fields'
import { TypePicker } from '@/features/manage-testcases/ui/type-picker'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

const SLOTS = [
  { slot: 'inputs', label: 'Entradas' },
  { slot: 'outputs', label: 'Saídas esperadas' },
] as const

type ImportDialogProps = {
  assessmentId: string
  questionId: string
  /** Test cases already in the question; imported ones are numbered after them. */
  existing: number
}

export function ImportDialog({ assessmentId, questionId, existing }: ImportDialogProps) {
  const { open, setOpen, close, files, lines, pick, form, mutation, inputCount, isMismatch, isReady } = useTestcaseImport(
    assessmentId,
    questionId
  )

  return (
    <FormDialog
      className="sm:max-w-5xl"
      description="Cada linha de entrada forma um caso com a linha de mesmo número das saídas. Os novos casos vão para o fim da lista."
      icon={FileUp}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
      open={open}
      title="Importar casos de teste"
      trigger={
        <Button size="xs" variant="ghost-muted">
          <FileUp /> Importar
        </Button>
      }
    >
      <form noValidate onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {SLOTS.map(({ slot, label }) => (
                <ImportFileSlot
                  file={files[slot]}
                  key={slot}
                  label={label}
                  lineCount={lines[slot]?.length}
                  onPick={(file) => pick(slot, file)}
                />
              ))}
            </div>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <TypePicker onChange={(value) => value !== 'KEEP' && field.onChange(value)} value={field.value} />
              )}
            />
            <LimitFields form={form} />
          </div>

          <ImportPreview
            existing={existing}
            inputs={lines.inputs}
            mismatch={isMismatch}
            outputs={lines.outputs}
            type={form.watch('type')}
          />
        </div>

        <div className="mt-5">
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
        </div>
        <DialogActions>
          <Button onClick={close} type="button" variant="outline">
            Cancelar
          </Button>
          <Button disabled={mutation.isPending || !isReady} type="submit">
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            {isReady && inputCount ? `Importar ${inputCount} ${inputCount === 1 ? 'caso' : 'casos'}` : 'Importar casos'}
          </Button>
        </DialogActions>
      </form>
    </FormDialog>
  )
}
