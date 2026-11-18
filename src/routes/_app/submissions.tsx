import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/widgets/placeholder'

export const Route = createFileRoute('/_app/submissions')({
  head: () => ({ meta: [{ title: 'Submissões · Correcta' }] }),
  component: () => <PlaceholderPage url="/submissions" />,
})
