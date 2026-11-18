import { createFileRoute } from '@tanstack/react-router'
import { AssignmentsPage } from '@/pages/assignments'

export const Route = createFileRoute('/_app/assignments')({
  head: () => ({ meta: [{ title: 'Listas · Correcta' }] }),
  component: AssignmentsPage,
})
