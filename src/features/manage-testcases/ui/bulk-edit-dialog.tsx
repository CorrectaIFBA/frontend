import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { bulkSchema, type BulkValues } from '@/features/manage-testcases/model/bulk-schema'
import { LimitFields } from '@/features/manage-testcases/ui/limit-fields'
import { TypePicker } from '@/features/manage-testcases/ui/type-picker'
import { bulkEditTestcases, type TestcaseBulkChange } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

export function BulkEditDialog({
  assessmentId,
  questionId,
  ids,
  onDone,
}: {
  assessmentId: string
  questionId: string
  ids: string[]
  onDone: () => void
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<BulkValues>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { type: 'KEEP', timeLimitSeconds: '', memoryLimitMB: '' },
  })
  const values = form.watch()
  const nothing = values.type === 'KEEP' && !values.timeLimitSeconds.trim() && !values.memoryLimitMB.trim()

  const mutation = useMutation({
    mutationFn: (submitted: BulkValues) => {
      const change: TestcaseBulkChange = {}
      if (submitted.type !== 'KEEP') change.type = submitted.type
      if (submitted.timeLimitSeconds) change.timeLimitSeconds = Number(submitted.timeLimitSeconds)
      if (submitted.memoryLimitMB) change.memoryLimitMB = Number(submitted.memoryLimitMB)
      return bulkEditTestcases(assessmentId, questionId, ids, change)
    },
    onSuccess: () => {
      toast.success(ids.length === 1 ? 'Caso de teste salvo.' : `${ids.length} casos de teste salvos.`)
      setOpen(false)
      onDone()
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  return (
    <FormDialog
      description="Só muda o que você alterar aqui. Entradas e saídas ficam como estão."
      icon={SlidersHorizontal}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset()
          mutation.reset()
        }
      }}
      open={open}
      title={ids.length === 1 ? 'Editar o caso selecionado' : `Editar ${ids.length} casos de teste`}
      trigger={
        <Button size="xs" variant="outline">
          <SlidersHorizontal /> Editar
        </Button>
      }
    >
      <form className="flex flex-col gap-5" noValidate onSubmit={form.handleSubmit((submitted) => mutation.mutate(submitted))}>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <TypePicker
              keepLabel="Manter o de cada caso"
              onChange={field.onChange}
              value={field.value === 'KEEP' ? null : field.value}
            />
          )}
        />
        <LimitFields form={form} placeholder="Manter" />
        <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
        <DialogActions>
          <Button onClick={() => setOpen(false)} type="button" variant="outline">
            Cancelar
          </Button>
          <Button disabled={mutation.isPending || nothing} type="submit">
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            Salvar alterações
          </Button>
        </DialogActions>
      </form>
    </FormDialog>
  )
}
