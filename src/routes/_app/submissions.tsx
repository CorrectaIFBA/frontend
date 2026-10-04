import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/shell/placeholder-page'

export const Route = createFileRoute('/_app/submissions')({
  head: () => ({ meta: [{ title: 'Submissões · Correcta' }] }),
  component: () => <PlaceholderPage url="/submissions" />,
})
