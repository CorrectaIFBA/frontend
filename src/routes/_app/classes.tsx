import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/shell/placeholder-page'

export const Route = createFileRoute('/_app/classes')({
  head: () => ({ meta: [{ title: 'Turmas · Correcta' }] }),
  component: () => <PlaceholderPage url="/classes" />,
})
