import { useNavigate, getRouteApi } from '@tanstack/react-router'
import { LoginForm } from '@/features/sign-in'
import { safeRedirect } from '@/pages/login/lib/safe-redirect'

const route = getRouteApi('/_auth/login')

export function LoginScreen() {
  const search = route.useSearch()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-[-0.03em]">Bem-vindo de volta</h1>
        <p className="text-muted-foreground text-sm">
          Use sua conta institucional.
        </p>
      </div>

      <LoginForm
        onSuccess={() => navigate({ to: safeRedirect(search.redirect), replace: true })}
      />

      <div className="flex flex-col gap-3 border-border border-t pt-5 text-muted-foreground text-xs leading-relaxed">
        <p>
          <span className="font-medium text-foreground">Primeiro acesso?</span> Crie sua senha pelo link enviado ao seu e-mail institucional.
        </p>
        <p>
          <span className="font-medium text-foreground">Esqueceu a senha?</span> Procure a
          gerência de registros acadêmicos do seu campus.
        </p>
      </div>
    </div>
  )
}
