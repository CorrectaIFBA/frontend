import { getRouteApi } from "@tanstack/react-router";
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { KeyRound, LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { fieldErrorsOf } from '@/pages/account-activation/lib/field-errors-of'
import { activationSchema, type ActivationValues, MAX_LENGTH } from '@/pages/account-activation/model/activation-schema'
import { ActivationDone } from '@/pages/account-activation/ui/activation-done'
import { LinkRejected } from '@/pages/account-activation/ui/link-rejected'
import { Requirements } from '@/pages/account-activation/ui/requirements'
import { ApiError, errorMessage } from '@/shared/api/errors'
import { createAccountPassword } from '@/shared/api/identity'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { PasswordInput } from '@/shared/ui/password-input'
import { PasswordStrength } from '@/shared/ui/password-strength'

const route = getRouteApi('/_auth/account-activation/$token')

export function AccountActivationScreen() {
  const { token } = route.useParams()

  const form = useForm<ActivationValues>({
    resolver: zodResolver(activationSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: ActivationValues) => createAccountPassword(token, values),
    onError: (error) => {
      if (!(error instanceof ApiError)) return
      for (const [field, message] of Object.entries(error.fieldErrors)) {
        if (field === 'password' || field === 'confirmPassword') {
          form.setError(field, { message })
        }
      }
    },
  })

  const linkRejected = mutation.error instanceof ApiError && mutation.error.status === 401
  const screen = mutation.isSuccess ? 'done' : linkRejected ? 'rejected' : 'form'

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        initial={{ opacity: 0, y: 8 }}
        key={screen}
        transition={{ duration: 0.2 }}
      >
        {screen === 'done' ? (
          <ActivationDone />
        ) : screen === 'rejected' ? (
          <LinkRejected message={errorMessage(mutation.error)} />
        ) : (
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <span className="label-xs mb-1 flex items-center gap-1.5 text-primary">
                <KeyRound className="size-3" />
                Primeiro acesso
              </span>
              <h1 className="font-semibold text-2xl tracking-[-0.03em]">Crie sua senha</h1>
              <p className="text-muted-foreground text-sm">
                Criar a senha ativa sua conta.
              </p>
            </div>

            <Form {...form}>
              <form
                className="flex flex-col gap-5"
                noValidate
                onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
              >
                <FormAlert
                  message={
                    mutation.isError && !Object.keys(fieldErrorsOf(mutation.error)).length
                      ? errorMessage(mutation.error)
                      : null
                  }
                />

                {/* Lets password managers file the new secret under the right site. */}
                <input autoComplete="username" className="hidden" readOnly type="text" />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          autoComplete="new-password"
                          autoFocus
                          className="h-9"
                          maxLength={MAX_LENGTH}
                          {...field}
                        />
                      </FormControl>
                      <PasswordStrength control={form.control} />
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repita a senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          autoComplete="new-password"
                          className="h-9"
                          maxLength={MAX_LENGTH}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Requirements control={form.control} />

                <Button className="mt-1 h-9" disabled={mutation.isPending} type="submit">
                  {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
                  {mutation.isPending ? 'Ativando…' : 'Criar senha e ativar conta'}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
