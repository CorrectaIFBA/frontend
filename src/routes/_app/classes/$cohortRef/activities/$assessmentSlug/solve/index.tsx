import { createFileRoute } from '@tanstack/react-router'
import { ResumeQuestion } from '@/pages/solve'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/solve/')({
  staticData: { chrome: 'focus' },
  component: ResumeQuestion,
})
