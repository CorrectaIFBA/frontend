import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from '@tanstack/react-query'
import { IdCard, UserPlus } from 'lucide-react'
import { KindMark } from '@/entities/profile'
import { CreatePersonDialog } from '@/features/create-person'
import { CreateProfileDialog } from '@/features/create-profile'
import { columns } from '@/pages/persons/ui/person-columns'
import { personsQueryOptions } from '@/shared/api/directory'
import { toPagination } from '@/shared/lib/list-search'
import { Button } from '@/shared/ui/button'
import { DataTable } from '@/shared/ui/data-table'
import { ListToolbar } from '@/shared/ui/list-toolbar'
import { PageContent } from '@/shared/ui/page-content'
import { PageTitle } from '@/shared/ui/page-title'
import { ResultCount } from '@/shared/ui/result-count'
import { SearchField } from '@/shared/ui/search-field'
import { Segmented } from '@/shared/ui/segmented'

const route = getRouteApi('/_app/persons/')

export function PersonsPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const pagination = toPagination(search)
  const query = useQuery(
    personsQueryOptions(
      {
        search: search.q,
        active: search.status === undefined ? undefined : search.status === 'active',
      },
      pagination
    )
  )

  const update = (next: Partial<typeof search>) =>
    navigate({ search: (previous) => ({ ...previous, ...next }) })

  return (
    <PageContent>
      <PageTitle
        actions={
          <>
            <CreatePersonDialog
              trigger={
                <Button variant="outline">
                  <IdCard /> Nova pessoa
                </Button>
              }
            />
            <CreateProfileDialog
              trigger={
                <Button>
                  <UserPlus /> Novo perfil institucional
                </Button>
              }
            />
          </>
        }
        description="Pessoas por CPF e seus perfis institucionais."
        leading={<KindMark icon={IdCard} />}
        title="Pessoas"
      />

      <ListToolbar>
        <SearchField
          onChange={(term) => update({ q: term || undefined, page: undefined })}
          placeholder="Nome ou CPF"
          value={search.q ?? ''}
        />
        <Segmented
          label="Situação"
          onChange={(status) =>
            update({ status: status === 'all' ? undefined : status, page: undefined })
          }
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'active', label: 'Ativas' },
            { value: 'inactive', label: 'Inativas' },
          ]}
          value={search.status ?? 'all'}
        />
        <ResultCount many="pessoas" one="pessoa" total={query.data?.totalElements} />
      </ListToolbar>

      <DataTable
        columns={columns}
        dir={pagination.sortDirection}
        emptyHint={
          search.q || search.status
            ? 'Ajuste a busca ou os filtros.'
            : 'Cadastre a primeira pessoa pelos botões acima.'
        }
        emptyTitle="Nenhuma pessoa encontrada"
        onPage={(page) => update({ page })}
        onRowClick={(person) =>
          navigate({ to: '/persons/$personId', params: { personId: person.id } })
        }
        onSort={(sort, dir) => update({ sort, dir, page: undefined })}
        query={query}
        rowKey={(person) => person.id}
        sort={pagination.sortBy}
      />
    </PageContent>
  )
}
