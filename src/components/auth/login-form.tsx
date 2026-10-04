import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle, LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormAlert } from '@/components/auth/form-alert'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApiError, errorMessage } from '@/lib/api/errors'
import type { SelfAccountInfo } from '@/lib/api/identity'
import { signIn } from '@/lib/auth/session'

const loginSchema = z.object({
  login: z.string().trim().min(1, 'Informe seu login.'),
  password: z.string().min(1, 'Informe sua senha.'),
})

type LoginValues = z.infer<typeof loginSchema>

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
