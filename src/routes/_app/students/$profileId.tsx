import { createFileRoute } from '@tanstack/react-router'
import { StudentsDetailPage } from '@/pages/profile-detail'

export const Route = createFileRoute('/_app/students/$profileId')({
  head: () => ({ meta: [{ title: 'Estudantes · Correcta' }] }),
  component: StudentsDetailPage,
})
