import { Plus, Ticket, UsersRound } from 'lucide-react'
import { KindMark } from '@/entities/profile'
import { CreateCohortDialog } from '@/features/create-cohort'
import { JoinCohortDialog } from '@/features/join-cohort'
import type { ProfileType } from '@/shared/api/identity'
import { Button } from '@/shared/ui/button'
import { PageTitle } from '@/shared/ui/page-title'

type CohortsPageTitleProps = {
  profileType?: ProfileType
}

export function CohortsPageTitle({ profileType }: CohortsPageTitleProps) {
  const isFaculty = profileType === 'FACULTY'

  return (
    <PageTitle
      actions={
        profileType && profileType !== 'STAFF' ? (
          <>
            <JoinCohortDialog
              trigger={
                <Button variant="outline">
                  <Ticket /> Entrar com código
                </Button>
              }
            />
            {isFaculty ? (
              <CreateCohortDialog
                trigger={
                  <Button>
                    <Plus /> Nova turma
                  </Button>
                }
              />
            ) : null}
          </>
        ) : null
      }
      description={
        profileType === 'STAFF'
          ? 'Todas as turmas da instituição.'
          : isFaculty
            ? 'As turmas que você criou ou das quais participa como docente.'
            : 'As turmas das quais você participa.'
      }
      leading={<KindMark icon={UsersRound} />}
      title="Turmas"
    />
  )
}
