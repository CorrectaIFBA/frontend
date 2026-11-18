import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCohortView, cohortSchema, type CohortValues, CohortFields } from '@/entities/cohort'
import { cohortAddress, updateCohort } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { Button } from '@/shared/ui/button'
import { Form } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'

export function DetailsForm() {
  const { cohort } = useCohortView()
  const navigate = useNavigate()
  const current = { name: cohort.name, slug: cohort.slug, description: cohort.description ?? '' }
  const form = useForm<CohortValues>({ resolver: zodResolver(cohortSchema), values: current })

  const mutation = useMutation({
    mutationFn: (values: CohortValues) =>
      updateCohort(cohort.id, {
        name: values.name,
        slug: values.slug || cohort.slug,
        description: values.description || undefined,
      }),
    onSuccess: (updated) => {
      toast.success('Detalhes salvos.')
      if (updated.slug !== cohort.slug) {
        navigate({
          to: '/classes/$cohortRef/manage',
          params: { cohortRef: cohortAddress(updated) },
          replace: true,
        })
      }
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 px-4 pt-4"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
        <CohortFields form={form} publicCode={cohort.publicCode} slugRequired />
        <div className="-mx-4 flex justify-end gap-2 border-border border-t bg-muted/40 px-4 py-3">
          <Button
            disabled={!form.formState.isDirty || mutation.isPending}
            onClick={() => form.reset(current)}
            type="button"
            variant="ghost-muted"
          >
            Descartar
          </Button>
          <Button disabled={!form.formState.isDirty || mutation.isPending} type="submit">
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            Salvar alterações
          </Button>
        </div>
      </form>
    </Form>
  )
}
