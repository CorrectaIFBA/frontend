import { createFileRoute } from '@tanstack/react-router'
import { JoinByCodePage } from '@/pages/join-cohort'

export const Route = createFileRoute('/_app/classes/join/$code')({
  head: () => ({ meta: [{ title: 'Entrar em uma turma · Correcta' }] }),
  component: JoinByCodePage,
})
