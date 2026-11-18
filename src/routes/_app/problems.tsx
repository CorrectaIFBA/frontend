import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/widgets/placeholder'

export const Route = createFileRoute('/_app/problems')({
  head: () => ({ meta: [{ title: 'Problemas · Correcta' }] }),
  component: () => <PlaceholderPage url="/problems" />,
})
