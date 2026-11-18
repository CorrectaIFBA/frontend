import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ClipboardList } from 'lucide-react'
import { useMyCohortsById, CohortNotice } from '@/entities/cohort'
import { AttemptRow } from '@/pages/assignments/ui/attempt-row'
import { errorMessage } from '@/shared/api/errors'
import { mySessionsQueryOptions } from '@/shared/api/sessions'
import { Button } from '@/shared/ui/button'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'
import { Skeleton } from '@/shared/ui/skeleton'

export function Attempts() {
  const query = useQuery(
    mySessionsQueryOptions(undefined, { page: 0, size: 100, sortBy: 'startedAt', sortDirection: 'desc' })
  )
  const cohorts = useMyCohortsById()

  if (query.isError) return <PanelNote>{errorMessage(query.error)}</PanelNote>
  if (query.isPending) return <Skeleton className="h-64 w-full rounded-lg" />

  const running = query.data.content.filter((session) => session.state === 'IN_PROGRESS')
  const finished = query.data.content.filter((session) => session.state !== 'IN_PROGRESS')

  if (!query.data.content.length) {
    return (
      <CohortNotice
        action={
          <Button asChild size="sm" variant="outline">
            <Link to="/classes">Ver turmas</Link>
          </Button>
        }
        hint="Inicie uma atividade na página da sua turma."
        icon={ClipboardList}
        title="Nenhuma atividade iniciada"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {running.length ? (
        <Panel>
          <PanelHeading title="Em andamento" />
          <ul className="divide-y divide-border">
            {running.map((session) => (
              <AttemptRow cohort={cohorts.get(session.cohortId ?? '')} key={session.id} session={session} />
            ))}
          </ul>
        </Panel>
      ) : null}
      {finished.length ? (
        <Panel>
          <PanelHeading title="Finalizadas" />
          <ul className="divide-y divide-border">
            {finished.map((session) => (
              <AttemptRow cohort={cohorts.get(session.cohortId ?? '')} key={session.id} session={session} />
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  )
}
