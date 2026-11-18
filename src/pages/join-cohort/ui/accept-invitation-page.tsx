import { getRouteApi } from "@tanstack/react-router";
import { MailOpen } from 'lucide-react'
import { JoinPage } from '@/pages/join-cohort/ui/join-page'
import { acceptInvitation } from '@/shared/api/cohorts'

const route = getRouteApi('/_app/classes/invitation/$cohortId')

export function AcceptInvitationPage() {
  const { cohortId } = route.useParams()

  return (
    <JoinPage
      confirmLabel="Aceitar convite"
      description="Um docente convidou você para uma turma. Aceite para entrar."
      icon={MailOpen}
      join={() => acceptInvitation(cohortId)}
      title="Convite para turma"
    />
  )
}
