import { getRouteApi } from "@tanstack/react-router";
import { Ticket } from 'lucide-react'
import { JoinPage } from '@/pages/join-cohort/ui/join-page'
import { joinWithCode } from '@/shared/api/cohorts'

const route = getRouteApi('/_app/classes/join/$code')

export function JoinByCodePage() {
  const { code } = route.useParams()

  return (
    <JoinPage
      confirmLabel="Entrar na turma"
      description="Confirme para entrar na turma."
      icon={Ticket}
      join={() => joinWithCode(code)}
      title="Entrar em uma turma"
    />
  )
}
