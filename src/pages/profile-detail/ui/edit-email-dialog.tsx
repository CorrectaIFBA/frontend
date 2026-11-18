import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle, Mail, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { emailSchema } from '@/pages/profile-detail/model/email-schema'
import { type InstitutionalProfile, updateProfile } from '@/shared/api/directory'
import { errorMessage } from '@/shared/api/errors'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'
import { Input } from '@/shared/ui/input'

export function EditEmailDialog({ profile }: { profile: InstitutionalProfile }) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    values: { email: profile.email },
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof emailSchema>) => updateProfile(profile.id, values),
    onSuccess: () => {
      setOpen(false)
      toast.success('E-mail atualizado.')
    },
    onError: (error) => applyFieldErrors(form, error),
  })

  return (
    <FormDialog
      description="Para onde vão os links de ativação e os avisos da conta."
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset({ email: profile.email })
          mutation.reset()
        }
      }}
      open={open}
      icon={Mail}
      title="Alterar e-mail"
      trigger={
        <Button size="xs" variant="ghost-muted">
          <Pencil /> Editar
        </Button>
      }
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input autoFocus className="h-9" type="email" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
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
