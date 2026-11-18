import { createFileRoute } from '@tanstack/react-router'
import { NewQuestion } from '@/pages/question-editor'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/questions/new')({
  head: () => ({ meta: [{ title: 'Nova questão · Correcta' }] }),
  component: NewQuestion,
})
