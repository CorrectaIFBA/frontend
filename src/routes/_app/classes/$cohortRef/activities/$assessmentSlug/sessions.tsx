import { createFileRoute } from '@tanstack/react-router'
import { parseSubmissionsSearch, SessionsPage } from '@/pages/activity-sessions'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/sessions')({
  head: () => ({ meta: [{ title: 'Envios · Correcta' }] }),
  validateSearch: parseSubmissionsSearch,
  component: SessionsPage,
})
