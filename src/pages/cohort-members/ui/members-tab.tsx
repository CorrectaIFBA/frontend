import { UsersRound } from 'lucide-react'
import { useCohortView, CohortNotice } from '@/entities/cohort'
import { MemberList } from '@/pages/cohort-members/ui/member-list'

export function MembersTab() {
  const { cohort } = useCohortView()

  if (cohort.status !== 'ACTIVE') {
    return (
      <CohortNotice
        hint={
          cohort.status === 'DRAFT'
            ? 'Ative a turma em Gerenciar para convidar membros.'
            : 'A lista de membros fica disponível enquanto a turma está ativa.'
        }
        icon={UsersRound}
        title={cohort.status === 'DRAFT' ? 'Turma em rascunho' : 'Turma arquivada'}
      />
    )
  }

  return <MemberList />
}
