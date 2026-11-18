import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import type { ProfileKind } from '@/entities/profile'
import { PROFILE_STATE_LABEL, KindMark, ProfileStateStatus } from '@/entities/profile'
import { CreateProfileDialog } from '@/features/create-profile'
import { PROFILE_STATES, type ProfileListSearch } from '@/pages/profile-list/model/profile-list-search'
import { ProfileIdentity } from '@/pages/profile-list/ui/profile-identity'
import { type InstitutionalProfile, profilesQueryOptions } from '@/shared/api/directory'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import { toPagination } from '@/shared/lib/list-search'
import { Button } from '@/shared/ui/button'
import { DataTable } from '@/shared/ui/data-table'
import type { Column } from '@/shared/ui/data-table-column'
import { IdentitySkeleton } from '@/shared/ui/identity-skeleton'
import { ListToolbar } from '@/shared/ui/list-toolbar'
import { PageContent } from '@/shared/ui/page-content'
import { PageTitle } from '@/shared/ui/page-title'
import { ResultCount } from '@/shared/ui/result-count'
import { SearchField } from '@/shared/ui/search-field'
import { Segmented } from '@/shared/ui/segmented'
import { Skeleton } from '@/shared/ui/skeleton'

/** One list for every profile type; the kind decides the copy and the extra columns. */
export function ProfileListPage({
  kind,
  search,
  onSearch,
}: {
  kind: ProfileKind
  search: ProfileListSearch
  onSearch: (next: Partial<ProfileListSearch>) => void
}) {
  const navigate = useNavigate()
  const pagination = toPagination(search)
  const query = useQuery(
    profilesQueryOptions({ type: kind.type, search: search.q, state: search.state }, pagination)
  )

  const columns: Column<InstitutionalProfile>[] = [
    {
      id: 'name',
      header: 'Nome',
      cell: (profile) => <ProfileIdentity profile={profile} />,
      skeleton: <IdentitySkeleton />,
    },
    {
      id: 'email',
      header: 'E-mail',
      sortKey: 'email',
      hideBelow: 'md',
      className: 'max-w-64 truncate',
      cell: (profile) => <span className="text-muted-foreground">{profile.email}</span>,
    },
    {
      id: 'state',
      header: 'Situação',
      sortKey: 'state',
      className: 'w-32',
      cell: (profile) => <ProfileStateStatus state={profile.state} />,
      skeleton: <Skeleton className="h-5 w-16 rounded-full" />,
    },
    {
      id: 'createdAt',
      header: 'Criado',
      sortKey: 'createdAt',
      hideBelow: 'sm',
      className: 'w-32 whitespace-nowrap',
      cell: (profile) => (
        <time
          className="text-muted-foreground text-xs tabular-nums"
          dateTime={profile.createdAt}
          title={dateTimeFormat.format(new Date(profile.createdAt))}
        >
          {relativeDate(profile.createdAt)}
        </time>
      ),
    },
  ]

  return (
    <PageContent>
      <PageTitle
        actions={
          <CreateProfileDialog
            defaultType={kind.type}
            trigger={
              <Button>
                <UserPlus /> Novo {kind.singular.toLowerCase()}
              </Button>
            }
          />
        }
        description={kind.description}
        leading={<KindMark icon={kind.icon} type={kind.type} />}
        title={kind.title}
      />

      <ListToolbar>
        <SearchField
          onChange={(term) => onSearch({ q: term || undefined, page: undefined })}
          placeholder="Nome, CPF, login ou e-mail"
          value={search.q ?? ''}
        />
        <Segmented
          label="Situação"
          onChange={(state) =>
            onSearch({ state: state === 'ALL' ? undefined : state, page: undefined })
          }
          options={[
            { value: 'ALL' as const, label: 'Todos' },
            ...PROFILE_STATES.map((state) => ({ value: state, label: PROFILE_STATE_LABEL[state] })),
          ]}
          value={search.state ?? 'ALL'}
        />
        <ResultCount
          many={kind.title.toLowerCase()}
          one={kind.singular.toLowerCase()}
          total={query.data?.totalElements}
        />
      </ListToolbar>

      <DataTable
        columns={columns}
        dir={pagination.sortDirection}
        emptyHint={
          search.q || search.state
            ? 'Ajuste a busca ou os filtros.'
            : `Crie o primeiro perfil de ${kind.singular.toLowerCase()} pelo botão acima.`
        }
        emptyTitle={`Nenhum ${kind.singular.toLowerCase()} encontrado`}
        onPage={(page) => onSearch({ page })}
        onRowClick={(profile) =>
          navigate({ to: `${kind.url}/$profileId`, params: { profileId: profile.id } })
        }
        onSort={(sort, dir) => onSearch({ sort, dir, page: undefined })}
        query={query}
        rowKey={(profile) => profile.id}
        sort={pagination.sortBy}
      />
    </PageContent>
  )
}
