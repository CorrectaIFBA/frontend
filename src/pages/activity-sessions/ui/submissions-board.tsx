import { useState } from 'react'
import { useCohortView } from '@/entities/cohort'
import { GradeSheet } from '@/features/grade-attempt'
import { studentName } from '@/pages/activity-sessions/lib/student-name'
import { useOpenSubmission } from '@/pages/activity-sessions/model/use-open-submission'
import { useFinishedColumns } from '@/pages/activity-sessions/model/use-finished-columns'
import { useOpenColumns } from '@/pages/activity-sessions/model/use-open-columns'
import { useRosterSearch, useRosterTable } from '@/pages/activity-sessions/model/use-roster-tables'
import { EventsSheet } from '@/pages/activity-sessions/ui/events-sheet'
import { RosterSection } from '@/pages/activity-sessions/ui/roster-section'
import type { Assessment } from '@/shared/api/assessments'
import type { RosterEntry } from '@/shared/api/sessions'
import { ListToolbar } from '@/shared/ui/list-toolbar'
import { SearchField } from '@/shared/ui/search-field'

export type SubmissionsBoardProps = { assessment: Assessment }

/**
 * The cohort against one activity, in two tables: who already submitted, and
 * who is still working or has not started. Both refresh on their own.
 */
export function SubmissionsBoard({ assessment }: SubmissionsBoardProps) {
  const { cohort } = useCohortView()
  const { term, onSearch } = useRosterSearch()
  const finished = useRosterTable(assessment.id, 'FINISHED')
  const open = useRosterTable(assessment.id, 'OPEN')
  const [inspected, setInspected] = useState<RosterEntry | null>(null)
  const [graded, setGraded] = useState<RosterEntry | null>(null)
  const openSubmission = useOpenSubmission(assessment)
  const options = { assessment, canAct: cohort.status === 'ACTIVE', onInspect: setInspected }
  const finishedColumns = useFinishedColumns({ ...options, onOpen: openSubmission, onGrade: setGraded })
  const openColumns = useOpenColumns(options)
  const noMatch = term ? 'Nenhum estudante com esse nome' : undefined

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-[20px] leading-tight tracking-[-0.03em]">Envios</h2>
        <p className="text-muted-foreground text-xs">
          Quem já entregou, quem está resolvendo e quem ainda não começou. As tabelas se atualizam sozinhas.
        </p>
      </div>

      <ListToolbar>
        <SearchField onChange={onSearch} placeholder="Buscar estudante pelo nome" value={term} />
      </ListToolbar>

      <RosterSection
        columns={finishedColumns}
        description="Entregas e tentativas encerradas pelo tempo."
        emptyHint={term ? undefined : 'Os envios aparecem aqui assim que os estudantes entregarem.'}
        emptyTitle={noMatch ?? 'Ninguém entregou ainda'}
        onRowClick={openSubmission}
        table={finished}
        title="Enviados"
      />

      <RosterSection
        columns={openColumns}
        description="Tentativas em andamento e estudantes que ainda não iniciaram."
        emptyHint={term ? undefined : 'Todos os estudantes da turma já entregaram.'}
        emptyTitle={noMatch ?? 'Ninguém pendente'}
        table={open}
        title="Em andamento e não iniciados"
      />

      <EventsSheet
        assessment={assessment}
        name={inspected ? studentName(inspected) : ''}
        onClose={() => setInspected(null)}
        session={inspected?.session ?? null}
      />

      <GradeSheet
        assessmentId={assessment.id}
        onClose={() => setGraded(null)}
        studentName={graded ? studentName(graded) : ''}
        studentProfileId={graded?.studentProfileId ?? null}
      />
    </>
  )
}
