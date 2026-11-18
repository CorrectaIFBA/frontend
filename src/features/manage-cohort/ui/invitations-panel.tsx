import { useQuery } from '@tanstack/react-query'
import { Link2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { COHORT_ROLE_LABEL, invitationLink, useCohortView, InvitationStatus } from '@/entities/cohort'
import { IdentityCell, ProfileTypeTag } from '@/entities/profile'
import { InviteDialog } from '@/features/manage-cohort/ui/invite-dialog'
import { type CohortInvitation, cohortInvitationsQueryOptions, revokeInvitation } from '@/shared/api/cohorts'
import type { SortDirection } from '@/shared/api/directory'
import { copy } from '@/shared/lib/copy'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import { PAGE_SIZE } from '@/shared/lib/list-search'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { DataTable } from '@/shared/ui/data-table'
import type { Column } from '@/shared/ui/data-table-column'
import { IdentitySkeleton } from '@/shared/ui/identity-skeleton'

/* ---------------------------------------------------------------------------
   Direct invitations
--------------------------------------------------------------------------- */

export function InvitationsPanel() {
  const { cohort } = useCohortView()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ by: string; dir: SortDirection }>({ by: 'invitedAt', dir: 'desc' })
  const query = useQuery(
    cohortInvitationsQueryOptions(cohort.id, {
      page: page - 1,
      size: PAGE_SIZE,
      sortBy: sort.by,
      sortDirection: sort.dir,
    })
  )

  const columns: Column<CohortInvitation>[] = [
    {
      id: 'person',
      header: 'Pessoa',
      cell: (invitation) => (
        <IdentityCell
          name={invitation.displayName ?? 'Perfil indisponível'}
          secondary={invitation.email ?? invitation.login ?? <span className="font-mono">{invitation.profileId}</span>}
          type={invitation.profileType ?? undefined}
        />
      ),
      skeleton: <IdentitySkeleton />,
    },
    {
      id: 'role',
      header: 'Papel',
      hideBelow: 'md',
      className: 'w-28',
      cell: (invitation) => <ProfileTypeTag label={COHORT_ROLE_LABEL[invitation.role]} type={invitation.role} />,
    },
    {
      id: 'status',
      header: 'Situação',
      className: 'w-28',
      cell: (invitation) => <InvitationStatus state={invitation.status} />,
    },
    {
      id: 'invitedAt',
      header: 'Enviado',
      sortKey: 'invitedAt',
      hideBelow: 'sm',
      className: 'w-28 whitespace-nowrap',
      cell: (invitation) => (
        <time className="text-muted-foreground text-xs" dateTime={invitation.invitedAt} title={dateTimeFormat.format(new Date(invitation.invitedAt))}>
          {relativeDate(invitation.invitedAt)}
        </time>
      ),
    },
    {
      id: 'expiresAt',
      header: 'Expira',
      sortKey: 'expiresAt',
      hideBelow: 'lg',
      className: 'w-28 whitespace-nowrap',
      cell: (invitation) =>
        invitation.expiresAt ? (
          <time className="text-muted-foreground text-xs" dateTime={invitation.expiresAt}>
            {dateTimeFormat.format(new Date(invitation.expiresAt))}
          </time>
        ) : (
          <span className="text-muted-foreground/60 text-xs">Sem prazo</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      className: 'w-20 text-right',
      cell: (invitation) =>
        invitation.status === 'PENDING' ? (
          <span className="inline-flex gap-0.5">
            <Button
              aria-label="Copiar link do convite"
              onClick={() => copy(invitationLink(cohort.id), 'Link do convite')}
              size="icon-sm"
              variant="ghost-muted"
            >
              <Link2 />
            </Button>
            <ConfirmDialog
              action={() => revokeInvitation(cohort.id, invitation.profileId)}
              confirmLabel="Revogar"
              description="O link do convite deixa de funcionar para esta pessoa."
              destructive
              notice={{ tone: 'attention', message: 'O link enviado não volta a valer. Para dar acesso, convide a pessoa de novo.' }}
              successMessage="Convite revogado."
              title={`Revogar o convite de ${invitation.displayName ?? 'este perfil'}?`}
              trigger={
                <Button aria-label="Revogar convite" size="icon-sm" variant="ghost-muted">
                  <X />
                </Button>
              }
            />
          </span>
        ) : null,
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-semibold text-[13px]">Convites</h2>
          <p className="text-muted-foreground text-xs">Convites individuais, para quem não vai usar o código.</p>
        </div>
        <InviteDialog
          onInvited={(invitee) =>
            toast.success(`Convite enviado para ${invitee}.`, {
              description: 'A pessoa recebe um e-mail e encontra o convite na página Turmas.',
              action: { label: 'Copiar link', onClick: () => copy(invitationLink(cohort.id), 'Link do convite') },
            })
          }
        />
      </div>
      <DataTable
        columns={columns}
        dir={sort.dir}
        emptyHint="Busque uma pessoa pelo nome, login ou e-mail para convidá-la."
        emptyTitle="Nenhum convite enviado"
        onPage={setPage}
        onSort={(by, dir) => {
          setSort({ by, dir })
          setPage(1)
        }}
        query={query}
        rowKey={(invitation) => invitation.id}
        sort={sort.by}
      />
    </div>
  )
}
