import { createFileRoute } from '@tanstack/react-router'
import { AcceptInvitationPage } from '@/pages/join-cohort'

export const Route = createFileRoute('/_app/classes/invitation/$cohortId')({
  head: () => ({ meta: [{ title: 'Convite para turma · Correcta' }] }),
  component: AcceptInvitationPage,
})
