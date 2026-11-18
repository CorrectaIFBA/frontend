import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { IdCard, LoaderCircle } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { usePersonLookup, CpfInput, NameFields, PersonLookupNotice } from '@/entities/person'
import { createPersonSchema, type CreatePersonValues } from '@/features/create-person/model/create-person-schema'
import { createPerson } from '@/shared/api/directory'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { normalizeCpf } from '@/shared/lib/cpf'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

export function CreatePersonDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const form = useForm<CreatePersonValues>({
    resolver: zodResolver(createPersonSchema),
    defaultValues: { documentNumber: '', legalName: '', socialName: '' },
  })
  const lookup = usePersonLookup(form.watch('documentNumber'))

  const mutation = useMutation({
    mutationFn: (values: CreatePersonValues) =>
      createPerson({
        documentNumber: normalizeCpf(values.documentNumber),
        legalName: values.legalName,
        socialName: values.socialName || undefined,
      }),
    onSuccess: (person) => {
      setOpen(false)
      toast.success(`${person.displayName} foi cadastrada.`)
      navigate({ to: '/persons/$personId', params: { personId: person.id } })
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  return (
    <FormDialog
      description="Cadastra a pessoa sem conta de acesso."
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset()
          mutation.reset()
        }
      }}
      open={open}
      icon={IdCard}
      title="Nova pessoa"
      trigger={trigger}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />

          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <CpfInput autoFocus {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <PersonLookupNotice
            existingHint="Esta pessoa já está cadastrada."
            lookup={lookup}
            newHint="Nenhuma pessoa com este CPF. Ela será cadastrada agora."
          />

          <NameFields form={form} />

          <DialogActions>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={mutation.isPending || Boolean(lookup.person)} type="submit">
              {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Cadastrar pessoa
            </Button>
          </DialogActions>
        </form>
      </Form>
    </FormDialog>
  )
}
