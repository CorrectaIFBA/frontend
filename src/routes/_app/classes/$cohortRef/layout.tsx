import { createFileRoute } from '@tanstack/react-router'
import { CohortLayout } from '@/pages/cohort'

export const Route = createFileRoute('/_app/classes/$cohortRef')({
  head: () => ({ meta: [{ title: 'Turmas · Correcta' }] }),
  component: CohortLayout,
})
