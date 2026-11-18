import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle, UserPen } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { NameFields } from '@/entities/person'
import { editPersonSchema, type EditPersonValues } from '@/features/edit-person/model/edit-person-schema'
import { type DetailedPerson, updatePerson } from '@/shared/api/directory'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { formatCpf } from '@/shared/lib/cpf'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { Form } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

export function EditPersonDialog({ person, trigger }: { person: DetailedPerson; trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const defaults = { legalName: person.legalName, socialName: person.socialName ?? '' }
  const form = useForm<EditPersonValues>({
    resolver: zodResolver(editPersonSchema),
    values: defaults,
  })

  const mutation = useMutation({
    // An empty social name is how the service is told to remove it.
    mutationFn: (values: EditPersonValues) => updatePerson(person.id, values),
    onSuccess: () => {
      setOpen(false)
      toast.success('Dados atualizados.')
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  return (
    <FormDialog
      description={`CPF ${formatCpf(person.documentNumber)}. O documento não pode ser alterado.`}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset(defaults)
          mutation.reset()
        }
      }}
      open={open}
      icon={UserPen}
      title="Editar pessoa"
      trigger={trigger}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
          <NameFields form={form} />
          <DialogActions>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={mutation.isPending || !form.formState.isDirty} type="submit">
              {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Form>
    </FormDialog>
  )
}
