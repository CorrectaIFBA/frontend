import { createFileRoute, redirect } from '@tanstack/react-router'
import { type LoginSearch, safeRedirect, LoginScreen } from '@/pages/login'
import { accountStore } from '@/shared/api/account-store'

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
