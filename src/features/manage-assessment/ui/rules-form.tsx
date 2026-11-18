import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { changesFrom } from '@/features/manage-assessment/lib/changes-from'
import { rulesSchema, rulesValues, type RulesValues } from '@/features/manage-assessment/model/assessment-schema'
import { RulesFields } from '@/features/manage-assessment/ui/rules-fields'
import { type Assessment, changeAssessmentParameters } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { sessionCountsQueryOptions } from '@/shared/api/sessions'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { Button } from '@/shared/ui/button'
import { Form } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { PanelNote } from '@/shared/ui/panel-note'

export function RulesForm({ assessment }: { assessment: Assessment }) {
  const current = rulesValues(assessment.parameters)
  const counts = useQuery({ ...sessionCountsQueryOptions(assessment.id), enabled: assessment.state !== 'DRAFT' })
  const started = Object.values(counts.data ?? {}).reduce((sum, total) => sum + total, 0)
  const form = useForm<RulesValues>({ resolver: zodResolver(rulesSchema), values: current })

  const mutation = useMutation({
    mutationFn: (values: RulesValues) => changeAssessmentParameters(assessment.id, changesFrom(current, values)),
    onSuccess: () => toast.success('Regras salvas.'),
    onError: (error) =>
      applyFieldErrors(form, error, { maximumTimeAllowed: 'timeLimit' }),
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 px-4 pt-4"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
        {assessment.state === 'PUBLISHED' ? (
          <PanelNote tone="warning">
            Os estudantes veem as novas regras ao salvar.
            {started ? ` ${started === 1 ? 'A tentativa já iniciada mantém' : `As ${started} tentativas já iniciadas mantêm`} as regras de quando começou.` : ''}
          </PanelNote>
        ) : null}
        <RulesFields control={form.control} />
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
            Salvar regras
          </Button>
        </div>
      </form>
    </Form>
  )
}
