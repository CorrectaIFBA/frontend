import { createFileRoute } from '@tanstack/react-router'
import { AccountActivationScreen } from '@/pages/account-activation'

export const Route = createFileRoute('/_auth/account-activation/$token')({
  head: () => ({ meta: [{ title: 'Ativar conta · Correcta' }] }),
  component: AccountActivationScreen,
})
