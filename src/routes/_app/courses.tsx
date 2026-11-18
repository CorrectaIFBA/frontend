import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/widgets/placeholder'

export const Route = createFileRoute('/_app/courses')({
  head: () => ({ meta: [{ title: 'Disciplinas · Correcta' }] }),
  component: () => <PlaceholderPage url="/courses" />,
})
