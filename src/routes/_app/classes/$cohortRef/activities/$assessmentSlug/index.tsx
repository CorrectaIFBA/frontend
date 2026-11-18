import { createFileRoute } from '@tanstack/react-router'
import { ActivityPage } from '@/pages/activity'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/')({
  head: () => ({ meta: [{ title: 'Atividade · Correcta' }] }),
  component: ActivityPage,
})
