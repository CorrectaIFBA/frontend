import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { LoaderCircle, UsersRound } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { cohortSchema, type CohortValues, CohortFields } from '@/entities/cohort'
import { cohortAddress, createCohort } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { Form } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

export function CreateCohortDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const form = useForm<CohortValues>({
    resolver: zodResolver(cohortSchema),
    defaultValues: { name: '', slug: '', description: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: CohortValues) =>
      createCohort({
        name: values.name,
        slug: values.slug || undefined,
        description: values.description || undefined,
      }),
    onSuccess: (cohort) => {
      setOpen(false)
      form.reset()
      toast.success('Turma criada como rascunho. Ative-a para convidar pessoas.')
      navigate({
        to: '/classes/$cohortRef/manage',
        params: { cohortRef: cohortAddress(cohort) },
      })
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  return (
    <FormDialog
      description="A turma começa em estado de rascunho, visível somente para você até ser ativada."
      icon={UsersRound}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) mutation.reset()
      }}
      open={open}
      title="Nova turma"
      trigger={trigger}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
          <CohortFields autoFocus form={form} />
          <DialogActions>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Criar turma
            </Button>
          </DialogActions>
        </form>
      </Form>
    </FormDialog>
  )
}
