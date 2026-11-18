import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ClipboardPlus, LoaderCircle } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createSchema, type CreateValues, rulesValues, toParameters } from '@/features/manage-assessment/model/assessment-schema'
import { DetailsFields } from '@/features/manage-assessment/ui/details-fields'
import { RulesFields } from '@/features/manage-assessment/ui/rules-fields'
import { createAssessment } from '@/shared/api/assessments'
import { type Cohort, cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { fromLocalInput } from '@/shared/lib/local-datetime'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { Form } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

export function CreateAssessmentDialog({ cohort, trigger }: { cohort: Cohort; trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { title: '', slug: '', description: '', dueDate: '', ...rulesValues(null) },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateValues) =>
      createAssessment({
        cohortId: cohort.id,
        title: values.title,
        slug: values.slug || undefined,
        description: values.description || undefined,
        dueDate: fromLocalInput(values.dueDate),
        parameters: toParameters(values),
      }),
    onSuccess: (assessment) => {
      setOpen(false)
      form.reset()
      toast.success('Atividade criada como rascunho.')
      navigate({
        to: '/classes/$cohortRef/activities/$assessmentSlug',
        params: { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug },
      })
    },
    onError: (error) =>
      applyFieldErrors(form, error, { 'parameters.maximumTimeAllowed': 'timeLimit' }),
  })

  return (
    <FormDialog
      description="Começa como rascunho, visível só para os docentes."
      icon={ClipboardPlus}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) mutation.reset()
      }}
      open={open}
      title="Nova atividade"
      trigger={trigger}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
          <DetailsFields autoFocus control={form.control} />
          <fieldset className="flex flex-col gap-3 rounded-md border border-border p-3">
            <legend className="px-1 font-medium text-sm">Regras</legend>
            <RulesFields control={form.control} />
          </fieldset>
          <DialogActions>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Criar atividade
            </Button>
          </DialogActions>
        </form>
      </Form>
    </FormDialog>
  )
}
