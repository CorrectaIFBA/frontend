import { createFileRoute } from '@tanstack/react-router'
import { parseReviewSearch, StudentSubmissionPage } from '@/pages/submission-review'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/submissions/$sessionId')({
  head: () => ({ meta: [{ title: 'Envio do estudante · Correcta' }] }),
  staticData: { chrome: 'focus' },
  validateSearch: parseReviewSearch,
  component: StudentSubmissionPage,
})
