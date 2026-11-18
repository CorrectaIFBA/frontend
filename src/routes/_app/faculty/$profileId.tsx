import { createFileRoute } from '@tanstack/react-router'
import { FacultyDetailPage } from '@/pages/profile-detail'

export const Route = createFileRoute('/_app/faculty/$profileId')({
  head: () => ({ meta: [{ title: 'Docentes · Correcta' }] }),
  component: FacultyDetailPage,
})
