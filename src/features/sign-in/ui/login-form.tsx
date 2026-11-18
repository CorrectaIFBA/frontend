import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle, LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginValues } from '@/features/sign-in/model/login-schema'
import { ApiError, errorMessage } from '@/shared/api/errors'
import type { SelfAccountInfo } from '@/shared/api/identity'
import { signIn } from '@/shared/api/session'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'

/** The sign-in form itself, shared by the login page and the add-account dialog. */
export function LoginForm({
  onSuccess,
  submitLabel = 'Entrar',
}: {
  onSuccess: (me: SelfAccountInfo) => void
  submitLabel?: string
}) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess,
    onError: (error) => {
      if (error instanceof ApiError && error.status === 400) {
        form.resetField('password')
        form.setFocus('password')
      }
    },
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />

        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  autoFocus
                  className="h-9"
                  placeholder="sua matrícula ou usuário"
                  spellCheck={false}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  className="h-9"
                  placeholder={'•'.repeat(10)}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button className="mt-1 h-9" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? <LoaderCircle className="animate-spin" /> : <LogIn />}
          {mutation.isPending ? 'Entrando…' : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
