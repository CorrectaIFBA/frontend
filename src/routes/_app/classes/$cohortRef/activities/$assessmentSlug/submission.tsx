import { createFileRoute } from '@tanstack/react-router'
import { MySubmissionPage, parseReviewSearch } from '@/pages/submission-review'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/submission')({
  head: () => ({ meta: [{ title: 'Seu envio · Correcta' }] }),
  staticData: { chrome: 'focus' },
  validateSearch: parseReviewSearch,
  component: MySubmissionPage,
})
