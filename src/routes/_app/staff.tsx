import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/shell/placeholder-page'

export const Route = createFileRoute('/_app/staff')({
  head: () => ({ meta: [{ title: 'Servidores · Correcta' }] }),
  component: () => <PlaceholderPage url="/staff" />,
})
