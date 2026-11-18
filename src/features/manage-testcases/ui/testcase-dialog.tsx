import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FlaskConical, LoaderCircle } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { testcaseSchema, type TestcaseValues, testcaseValues } from '@/features/manage-testcases/model/testcase-schema'
import { LimitFields } from '@/features/manage-testcases/ui/limit-fields'
import { SelectBox } from '@/features/manage-testcases/ui/select-box'
import { TypePicker } from '@/features/manage-testcases/ui/type-picker'
import { createTestcase, editTestcase, type Testcase } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { cn } from '@/shared/lib/cn'
import { useLinkedScroll } from '@/shared/lib/use-linked-scroll'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'
import { Textarea } from '@/shared/ui/textarea'

export function TestcaseDialog({
  assessmentId,
  questionId,
  testcase,
  number,
  trigger,
}: {
  assessmentId: string
  questionId: string
  testcase?: Testcase
  number?: number
  trigger: ReactNode
}) {
  const [open, setOpen] = useState(false)
  // A second add right after the first keeps the dialog open for the next case.
  const [another, setAnother] = useState(false)
  const linked = useLinkedScroll()
  const form = useForm<TestcaseValues>({
    resolver: zodResolver(testcaseSchema),
    defaultValues: testcaseValues(testcase),
  })

  const mutation = useMutation({
    mutationFn: (values: TestcaseValues) => {
      const body = {
        ...values,
        timeLimitSeconds: Number(values.timeLimitSeconds),
        memoryLimitMB: Number(values.memoryLimitMB),
      }
      return testcase ? editTestcase(assessmentId, testcase, body) : createTestcase(assessmentId, questionId, body)
    },
    onSuccess: (_, values) => {
      toast.success(testcase ? 'Caso de teste salvo.' : 'Caso de teste adicionado.')
      if (!testcase && another) {
        // Same type and limits for the next one; only the values start over.
        form.reset({ ...values, input: '', expectedOutput: '' })
        form.setFocus('input')
        return
      }
      setOpen(false)
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  const ioFields = [
    { name: 'input', label: 'Entrada', hint: 'O que o programa lê da entrada padrão. Pode ficar vazia.' },
    { name: 'expectedOutput', label: 'Saída esperada', hint: 'O que o programa precisa escrever, espaços inclusive.' },
  ] as const

  return (
    <FormDialog
      description="A saída do programa precisa ser idêntica à esperada."
      icon={FlaskConical}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) form.reset(testcaseValues(testcase))
        else mutation.reset()
      }}
      open={open}
      title={testcase ? `Editar o caso ${number}` : 'Novo caso de teste'}
      trigger={trigger}
    >
      <form className="flex flex-col gap-5" noValidate onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div className="grid gap-3 sm:grid-cols-2">
          {ioFields.map((item, index) => {
            const scroll = linked(index === 0 ? 0 : 1)
            return (
              <Controller
                control={form.control}
                key={item.name}
                name={item.name}
                render={({ field, fieldState }) => (
                  <label className="flex flex-col gap-1.5">
                    <span className="font-medium text-sm">{item.label}</span>
                    <Textarea
                      aria-invalid={Boolean(fieldState.error)}
                      autoFocus={index === 0}
                      className="min-h-32 whitespace-pre font-mono text-[12.5px]!"
                      rows={6}
                      spellCheck={false}
                      wrap="off"
                      {...field}
                      onScroll={scroll.onScroll}
                      ref={(element) => {
                        field.ref(element)
                        scroll.ref(element)
                      }}
                    />
                    <span className={cn('text-xs', fieldState.error ? 'text-destructive' : 'text-muted-foreground')}>
                      {fieldState.error?.message ?? item.hint}
                    </span>
                  </label>
                )}
              />
            )
          })}
        </div>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <TypePicker onChange={(value) => value !== 'KEEP' && field.onChange(value)} value={field.value} />
          )}
        />
        <LimitFields form={form} />
        <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
        <DialogActions>
          {testcase ? null : (
            <label className="mr-auto flex cursor-pointer items-center gap-2 text-muted-foreground text-xs">
              <SelectBox checked={another} label="Adicionar outro em seguida" onChange={() => setAnother((on) => !on)} />
              <span aria-hidden>Adicionar outro em seguida</span>
            </label>
          )}
          <Button onClick={() => setOpen(false)} type="button" variant="outline">
            Cancelar
          </Button>
          <Button disabled={mutation.isPending || (testcase && !form.formState.isDirty)} type="submit">
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            {testcase ? 'Salvar caso' : 'Adicionar caso'}
          </Button>
        </DialogActions>
      </form>
    </FormDialog>
  )
}
