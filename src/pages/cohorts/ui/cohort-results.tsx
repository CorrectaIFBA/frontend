import { CircleAlert, UsersRound } from 'lucide-react'
import { CohortNotice } from '@/entities/cohort'
import type { CohortList } from '@/pages/cohorts/model/use-cohort-list'
import { CardGrid } from '@/pages/cohorts/ui/card-grid'
import { CohortCard } from '@/pages/cohorts/ui/cohort-card'
import { CohortCardSkeleton } from '@/pages/cohorts/ui/cohort-card-skeleton'
import { errorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { Pager } from '@/shared/ui/pager'

type CohortResultsProps = {
  list: CohortList
}

export function CohortResults({ list }: CohortResultsProps) {
  const { query, onSearch, isFiltered, profileType, isFaculty, me } = list

  if (query.isPending) {
    return (
      <CardGrid>
        {Array.from({ length: 6 }, (_, index) => (
          <CohortCardSkeleton key={`skeleton-${index + 1}`} />
        ))}
      </CardGrid>
    )
  }

  if (query.isError) {
    return (
      <CohortNotice
        action={
          <Button onClick={() => query.refetch()} size="sm" variant="outline">
            Tentar novamente
          </Button>
        }
        icon={CircleAlert}
        hint={errorMessage(query.error)}
        title="Não foi possível carregar as turmas"
      />
    )
  }

  if (query.data.content.length === 0) {
    return (
      <CohortNotice
        action={
          isFiltered ? (
            <Button
              onClick={() =>
                onSearch({ q: undefined, status: undefined, mine: undefined, from: undefined, to: undefined, page: undefined })
              }
              size="sm"
              variant="outline"
            >
              Limpar filtros
            </Button>
          ) : null
        }
        hint={
          isFiltered
            ? 'Nenhuma turma corresponde aos filtros.'
            : profileType === 'STAFF'
              ? 'Nenhuma turma foi criada ainda. Docentes criam as turmas.'
              : isFaculty
                ? 'Crie uma turma ou entre com um código de convite.'
                : 'Entre em uma turma com o código que o seu docente compartilhou.'
        }
        icon={UsersRound}
        title={isFiltered ? 'Nada encontrado' : 'Nenhuma turma ainda'}
      />
    )
  }

  return (
    <div className={cn('flex flex-col gap-4 transition-opacity', query.isPlaceholderData && 'opacity-55')}>
      <CardGrid>
        {query.data.content.map((cohort) => (
          <CohortCard cohort={cohort} key={cohort.id} owned={cohort.ownerProfileId === me?.profile.profileId} />
        ))}
      </CardGrid>
      {query.data.totalPages > 1 ? (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Pager data={query.data} onPage={(page) => onSearch({ page })} />
        </div>
      ) : null}
    </div>
  )
}
