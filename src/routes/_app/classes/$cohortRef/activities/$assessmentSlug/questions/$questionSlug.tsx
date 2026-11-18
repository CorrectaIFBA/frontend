import { createFileRoute } from '@tanstack/react-router'
import { EditQuestion } from '@/pages/question-editor'

export const Route = createFileRoute('/_app/classes/$cohortRef/activities/$assessmentSlug/questions/$questionSlug')({
  head: () => ({ meta: [{ title: 'Questão · Correcta' }] }),
  component: EditQuestion,
})
