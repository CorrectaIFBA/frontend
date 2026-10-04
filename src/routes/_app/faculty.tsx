import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/shell/placeholder-page'

export const Route = createFileRoute('/_app/faculty')({
  head: () => ({ meta: [{ title: 'Docentes · Correcta' }] }),
  component: () => <PlaceholderPage url="/faculty" />,
})
