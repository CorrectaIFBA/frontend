import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, KeyRound, LinkIcon, LoaderCircle } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { AnimatedCheck } from '@/components/auth/animated-check'
import { FormAlert } from '@/components/auth/form-alert'
import { PasswordInput } from '@/components/auth/password-input'
import { PasswordStrength } from '@/components/auth/password-strength'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ApiError, errorMessage } from '@/lib/api/errors'
import { createAccountPassword } from '@/lib/api/identity'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth/account-activation/$token')({
  head: () => ({ meta: [{ title: 'Ativar conta · Correcta' }] }),
  component: AccountActivationScreen,
})

/* Mirrors CreatePasswordRequest on the identity service. */
const MIN_LENGTH = 8
const MAX_LENGTH = 128

const activationSchema = z
  .object({
    password: z
      .string()
      .min(MIN_LENGTH, `Use pelo menos ${MIN_LENGTH} caracteres.`)
      .max(MAX_LENGTH, `Use no máximo ${MAX_LENGTH} caracteres.`),
    confirmPassword: z.string().min(1, 'Repita a senha.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })

type ActivationValues = z.infer<typeof activationSchema>

function AccountActivationScreen() {
  const { token } = Route.useParams()

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
                Ela vale para todo o Correcta. Depois de criada, sua conta é ativada e você já
                pode entrar.
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

function fieldErrorsOf(error: unknown) {
  return error instanceof ApiError ? error.fieldErrors : {}
}

/** The rules the server enforces, ticked off as they are met. */
function Requirements({ control }: { control: ReturnType<typeof useForm<ActivationValues>>['control'] }) {
  const [password, confirmPassword] = useWatch({
    control,
    name: ['password', 'confirmPassword'],
  })

  const rules = [
    {
      label: `Entre ${MIN_LENGTH} e ${MAX_LENGTH} caracteres`,
      met: password.length >= MIN_LENGTH && password.length <= MAX_LENGTH,
    },
    { label: 'As duas senhas coincidem', met: password.length > 0 && password === confirmPassword },
  ]

  return (
    <ul className="flex flex-col gap-1.5">
      {rules.map((rule) => (
        <li
          className={cn(
            'flex items-center gap-2 text-xs transition-colors',
            rule.met ? 'text-foreground' : 'text-muted-foreground'
          )}
          key={rule.label}
        >
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded-full border transition-colors',
              rule.met ? 'border-success bg-success text-white' : 'border-border-strong'
            )}
          >
            {rule.met ? <Check className="size-2.5" strokeWidth={3.5} /> : null}
          </span>
          {rule.label}
        </li>
      ))}
    </ul>
  )
}

function ActivationDone() {
  return (
    <div className="flex flex-col items-start gap-6">
      <AnimatedCheck />
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-[-0.03em]">Conta ativada</h1>
        <p className="text-muted-foreground text-sm">
          Sua senha foi criada. Entre com o login informado no e-mail de ativação e a senha que
          você acabou de definir.
        </p>
      </div>
      <Link
        className={cn(buttonVariants(), 'h-9 w-full')}
        replace
        search={{}}
        to="/login"
      >
        Ir para o login
        <ArrowRight />
      </Link>
    </div>
  )
}

function LinkRejected({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-start gap-6">
      <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        <LinkIcon className="size-5" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-[-0.03em]">Este link não vale mais</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
        <p className="text-muted-foreground text-sm">
          Links de ativação expiram em 7 dias e só podem ser usados uma vez. Se sua conta já foi
          ativada, é só entrar.
        </p>
      </div>
      <Link className={cn(buttonVariants({ variant: 'outline' }), 'h-9 w-full')} search={{}} to="/login">
        Ir para o login
      </Link>
    </div>
  )
}
