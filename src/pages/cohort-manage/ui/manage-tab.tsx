import { Navigate } from '@tanstack/react-router'
import { MailPlus } from 'lucide-react'
import { useCohortView, CohortNotice } from '@/entities/cohort'
import { DeletePanel, DetailsPanel, InvitationCodePanel, InvitationsPanel, StatusPanel } from '@/features/manage-cohort'
import { cohortAddress } from '@/shared/api/cohorts'

/*
  What the cohort's faculty can change. Ownership splits it: the owner edits
  the cohort itself, and every faculty member manages who gets in.
*/
export function ManageTab() {
  const { cohort, isFaculty, isOwner } = useCohortView()

  if (!isFaculty) {
    return (
      <Navigate params={{ cohortRef: cohortAddress(cohort) }} replace to="/classes/$cohortRef" />
    )
  }

  const active = cohort.status === 'ACTIVE'

  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <DetailsPanel />
        <div className="flex flex-col gap-4">
          <StatusPanel />
          {active ? <InvitationCodePanel /> : null}
          {isOwner && cohort.status === 'DRAFT' ? <DeletePanel /> : null}
        </div>
      </div>

      {active ? (
        <InvitationsPanel />
      ) : (
        <CohortNotice
          hint={
            cohort.status === 'DRAFT'
              ? 'Ative a turma para gerar um código de convite ou convidar pessoas.'
              : 'Reative a turma para convidar pessoas.'
          }
          icon={MailPlus}
          title="Convites indisponíveis"
        />
      )}
    </div>
  )
}
