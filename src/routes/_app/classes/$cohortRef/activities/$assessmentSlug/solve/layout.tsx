import { createFileRoute } from '@tanstack/react-router'
import { SolveLayout } from '@/pages/solve'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/solve')({
  head: () => ({ meta: [{ title: 'Atividade em andamento · Correcta' }] }),
  staticData: { chrome: 'focus' },
  component: SolveLayout,
})
