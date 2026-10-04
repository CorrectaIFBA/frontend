import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/shell/placeholder-page'

export const Route = createFileRoute('/_app/assignments')({
  head: () => ({ meta: [{ title: 'Listas · Correcta' }] }),
  component: () => <PlaceholderPage url="/assignments" />,
})
