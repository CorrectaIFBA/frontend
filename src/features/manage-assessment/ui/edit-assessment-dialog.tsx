import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ClipboardPen, LoaderCircle } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCohortView } from '@/entities/cohort'
import { detailsSchema, type DetailsValues } from '@/features/manage-assessment/model/assessment-schema'
import { DetailsFields } from '@/features/manage-assessment/ui/details-fields'
import { type Assessment, editAssessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { fromLocalInput, toLocalInput } from '@/shared/lib/local-datetime'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { Form } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

export function EditAssessmentDialog({ assessment, trigger }: { assessment: Assessment; trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { cohort } = useCohortView()
  const navigate = useNavigate()
  const current = {
    title: assessment.title,
    slug: assessment.slug,
    description: assessment.description ?? '',
    dueDate: toLocalInput(assessment.dueDate),
  }
  const form = useForm<DetailsValues>({ resolver: zodResolver(detailsSchema), values: current })

  const mutation = useMutation({
    mutationFn: (values: DetailsValues) =>
      editAssessment(assessment.id, {
        title: values.title,
        // Cleared means unchanged; the service keeps the current address.
        slug: values.slug || undefined,
        description: values.description || undefined,
        dueDate: fromLocalInput(values.dueDate),
      }),
    onSuccess: (updated) => {
      setOpen(false)
      toast.success('Atividade salva.')
      if (updated.slug !== assessment.slug) {
        navigate({
          to: '/classes/$cohortRef/activities/$assessmentSlug',
          params: { cohortRef: cohortAddress(cohort), assessmentSlug: updated.slug },
          replace: true,
        })
      }
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  return (
    <FormDialog
      description={
        assessment.state === 'PUBLISHED'
          ? 'Os estudantes veem as mudanças assim que você salvar.'
          : 'Título, instruções e prazo de entrega.'
      }
      icon={ClipboardPen}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          mutation.reset()
          form.reset(current)
        }
      }}
      open={open}
      title="Editar atividade"
      trigger={trigger}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
          <DetailsFields autoFocus control={form.control} editing />
          <DialogActions>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={!form.formState.isDirty || mutation.isPending} type="submit">
              {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Salvar alterações
            </Button>
          </DialogActions>
        </form>
      </Form>
    </FormDialog>
  )
}
