import { createFileRoute } from '@tanstack/react-router'
import { SolveQuestion } from '@/pages/solve'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/solve/$questionSlug')({
  staticData: { chrome: 'focus' },
  component: SolveQuestion,
})
