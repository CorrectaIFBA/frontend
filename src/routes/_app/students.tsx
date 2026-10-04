import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/shell/placeholder-page'

export const Route = createFileRoute('/_app/students')({
  head: () => ({ meta: [{ title: 'Estudantes · Correcta' }] }),
  component: () => <PlaceholderPage url="/students" />,
})
