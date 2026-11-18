import { COHORT_STATE_LABEL } from '@/entities/cohort'
import type { CohortList } from '@/pages/cohorts/model/use-cohort-list'
import { CreatedBetween } from '@/pages/cohorts/ui/created-between'
import { MineToggle } from '@/pages/cohorts/ui/mine-toggle'
import { SortMenu } from '@/pages/cohorts/ui/sort-menu'
import { COHORT_STATES } from '@/shared/api/cohorts'
import { ListToolbar } from '@/shared/ui/list-toolbar'
import { ResultCount } from '@/shared/ui/result-count'
import { SearchField } from '@/shared/ui/search-field'
import { Segmented } from '@/shared/ui/segmented'

type CohortFiltersProps = {
  list: CohortList
}

export function CohortFilters({ list }: CohortFiltersProps) {
  const { search, onSearch, isFaculty, query, sort } = list

  return (
    <ListToolbar>
      <SearchField
        onChange={(term) => onSearch({ q: term || undefined, page: undefined })}
        placeholder="Nome ou endereço da turma"
        value={search.q ?? ''}
      />
      <Segmented
        label="Situação"
        onChange={(status) => onSearch({ status: status === 'ALL' ? undefined : status, page: undefined })}
        options={[
          { value: 'ALL' as const, label: 'Todas' },
          ...COHORT_STATES.map((state) => ({ value: state, label: `${COHORT_STATE_LABEL[state]}s` })),
        ]}
        value={search.status ?? 'ALL'}
      />
      {isFaculty ? (
        <MineToggle isOn={Boolean(search.mine)} onToggle={() => onSearch({ mine: search.mine ? undefined : true, page: undefined })} />
      ) : null}
      <CreatedBetween from={search.from} onChange={(range) => onSearch({ ...range, page: undefined })} to={search.to} />
      <SortMenu onSelect={(option) => onSearch({ sort: option.sort, dir: option.dir, page: undefined })} sort={sort} />
      <ResultCount many="turmas" one="turma" total={query.data?.totalElements} />
    </ListToolbar>
  )
}
