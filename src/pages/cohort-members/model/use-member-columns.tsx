import { UserMinus } from 'lucide-react'
import { useCohortView } from '@/entities/cohort'
import { IdentityCell } from '@/entities/profile'
import { type CohortMember, removeMember } from '@/shared/api/cohorts'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import type { Column } from '@/shared/ui/data-table-column'
import { IdentitySkeleton } from '@/shared/ui/identity-skeleton'

export function useMemberColumns(): Column<CohortMember>[] {
  const { cohort, profileId, isFaculty } = useCohortView()

  return [
    {
      id: 'name',
      header: 'Nome',
      cell: (member) => (
        <IdentityCell
          name={member.displayName ?? 'Perfil indisponível'}
          secondary={
            member.profileId === cohort.ownerProfileId
              ? 'Responsável pela turma'
              : member.profileId === profileId
                ? 'Você'
                : undefined
          }
          type={member.profileType ?? undefined}
        />
      ),
      skeleton: <IdentitySkeleton />,
    },
    {
      id: 'joinedAt',
      header: 'Entrou',
      hideBelow: 'sm',
      className: 'w-36 whitespace-nowrap',
      cell: (member) => (
        <time
          className="text-muted-foreground text-xs"
          dateTime={member.joinedAt}
          title={dateTimeFormat.format(new Date(member.joinedAt))}
        >
          {relativeDate(member.joinedAt)}
        </time>
      ),
    },
    ...(isFaculty
      ? [
          {
            id: 'actions',
            header: '',
            className: 'w-12 text-right',
            cell: (member: CohortMember) =>
              // The owner cannot be removed, and removing oneself would leave the page under one's feet.
              member.profileId === cohort.ownerProfileId || member.profileId === profileId ? null : (
                <ConfirmDialog
                  action={() => removeMember(cohort.id, member.profileId)}
                  confirmLabel="Remover"
                  description="A pessoa deixa de ver a turma."
                  destructive
                  notice={{ tone: 'attention', message: 'Ela só pode voltar se for convidada novamente.' }}
                  successMessage="Membro removido."
                  title={`Remover ${member.displayName ?? 'este membro'}?`}
                  trigger={
                    <Button aria-label={`Remover ${member.displayName ?? 'membro'}`} size="icon-sm" variant="ghost-muted">
                      <UserMinus />
                    </Button>
                  }
                />
              ),
          } satisfies Column<CohortMember>,
        ]
      : []),
  ]
}
