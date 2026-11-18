import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from '@tanstack/react-query'
import { ClipboardList, Plus, SearchX } from 'lucide-react'
import { useCohortView, CohortNotice } from '@/entities/cohort'
import { CreateAssessmentDialog } from '@/features/manage-assessment'
import { ORDERS, STATE_FILTERS } from '@/pages/cohort-activities/model/activity-search'
import { ActivityListSkeleton } from '@/pages/cohort-activities/ui/activity-list-skeleton'
import { ActivityRow } from '@/pages/cohort-activities/ui/activity-row'
import { assessmentsQueryOptions } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { PAGE_SIZE } from '@/shared/lib/list-search'
import { Button } from '@/shared/ui/button'
import { Pager } from '@/shared/ui/pager'
import { PanelNote } from '@/shared/ui/panel-note'
import { ResultCount } from '@/shared/ui/result-count'
import { SearchField } from '@/shared/ui/search-field'
import { Segmented } from '@/shared/ui/segmented'

const route = getRouteApi('/_app/classes/$cohortRef/')

/*
  The cohort's activities, like a classroom's classwork: faculty see every
  state and create new ones; students see only what was published.
*/
export function ActivityTab() {
  const { cohort, isFaculty } = useCohortView()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const query = useQuery(
    assessmentsQueryOptions(
      { cohortId: cohort.id, title: search.q, state: isFaculty ? search.state : undefined },
      {
        page: (search.page ?? 1) - 1,
        size: PAGE_SIZE,
        sortBy: search.order === 'due' ? 'dueDate' : 'createdAt',
        sortDirection: search.order === 'due' ? 'asc' : 'desc',
      }
    )
  )
  const canCreate = isFaculty && cohort.status === 'ACTIVE'
  const filtered = Boolean(search.q || search.state)

  const createButton = canCreate ? (
    <CreateAssessmentDialog
      cohort={cohort}
      trigger={
        <Button size="sm">
          <Plus /> Nova atividade
        </Button>
      }
    />
  ) : null

  return (
    <div className="flex flex-col gap-4">
      {/*
        Filters on the left wrap among themselves; the count and the create
        button keep the top-right corner, level with the first row of filters.
      */}
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <div className="w-full sm:w-56">
            <SearchField
              onChange={(term) => navigate({ search: (previous) => ({ ...previous, q: term || undefined, page: undefined }) })}
              placeholder="Buscar pelo título"
              value={search.q ?? ''}
            />
          </div>
          {isFaculty ? (
            <Segmented
              label="Situação"
              onChange={(state) =>
                navigate({
                  search: (previous) => ({ ...previous, state: state === 'ALL' ? undefined : state, page: undefined }),
                })
              }
              options={[...STATE_FILTERS]}
              value={search.state ?? 'ALL'}
            />
          ) : null}
          <Segmented
            label="Ordem"
            onChange={(order) =>
              navigate({
                search: (previous) => ({ ...previous, order: order === 'due' ? 'due' : undefined, page: undefined }),
              })
            }
            options={[...ORDERS]}
            value={search.order ?? 'recent'}
          />
        </div>
        <div className="flex h-8 shrink-0 items-center gap-3">
          <ResultCount many="atividades" one="atividade" total={query.data?.totalElements} />
          {createButton}
        </div>
      </div>

      {isFaculty && cohort.status !== 'ACTIVE' ? (
        <PanelNote>
          {cohort.status === 'DRAFT'
            ? 'Ative a turma em Gerenciar para criar e publicar atividades.'
            : 'A turma está arquivada: as atividades ficam somente leitura.'}
        </PanelNote>
      ) : null}

      {query.isError ? (
        <CohortNotice
          action={
            <Button onClick={() => query.refetch()} size="sm" variant="outline">
              Tentar novamente
            </Button>
          }
          hint={errorMessage(query.error)}
          icon={ClipboardList}
          title="Não foi possível carregar as atividades"
        />
      ) : query.isPending ? (
        <ActivityListSkeleton />
      ) : query.data.content.length === 0 ? (
        filtered ? (
          <CohortNotice
            hint="Mude a busca ou a situação."
            icon={SearchX}
            title="Nada encontrado"
          />
        ) : (
          <CohortNotice
            action={createButton}
            hint={
              isFaculty
                ? 'Novas atividades ficam em rascunho até a publicação.'
                : 'Atividades publicadas aparecem aqui.'
            }
            icon={ClipboardList}
            title={isFaculty ? 'Nenhuma atividade ainda' : 'Nenhuma atividade publicada'}
          />
        )
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <ul className={cn('divide-y divide-border', query.isPlaceholderData && 'opacity-60')}>
            {query.data.content.map((assessment) => (
              <li key={assessment.id}>
                <ActivityRow assessment={assessment} showState={isFaculty} />
              </li>
            ))}
          </ul>
          {query.data.totalPages > 1 ? (
            <Pager data={query.data} onPage={(page) => navigate({ search: (previous) => ({ ...previous, page }) })} />
          ) : null}
        </div>
      )}
    </div>
  )
}
