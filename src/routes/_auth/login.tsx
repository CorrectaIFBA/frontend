import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/login-form'
import { accountStore } from '@/lib/auth/account-store'

type LoginSearch = {
  /** Where to go after signing in; only same-app paths are honoured. */
  redirect?: string
}

function safeRedirect(target: string | undefined) {
  return target?.startsWith('/') && !target.startsWith('//') ? target : '/'
}

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (accountStore.active()) {
      throw redirect({ to: safeRedirect(search.redirect) })
    }
  },
  head: () => ({ meta: [{ title: 'Entrar · Correcta' }] }),
  component: LoginScreen,
})

function LoginScreen() {
  const search = Route.useSearch()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-[-0.03em]">Bem-vindo de volta</h1>
        <p className="text-muted-foreground text-sm">
          Entre com o login e a senha da sua conta institucional.
        </p>
      </div>

      <LoginForm
        onSuccess={() => navigate({ to: safeRedirect(search.redirect), replace: true })}
      />

      <div className="flex flex-col gap-3 border-border border-t pt-5 text-muted-foreground text-xs leading-relaxed">
        <p>
          <span className="font-medium text-foreground">Primeiro acesso?</span> Abra o link de
          ativação enviado ao seu e-mail institucional para criar sua senha.
        </p>
        <p>
          <span className="font-medium text-foreground">Esqueceu a senha?</span> Procure a
          gerência de registros acadêmicos do seu campus.
        </p>
      </div>
    </div>
  )
}
