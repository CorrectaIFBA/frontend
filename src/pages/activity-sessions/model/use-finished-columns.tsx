import { studentName } from '@/pages/activity-sessions/lib/student-name'
import { AttemptCell } from '@/pages/activity-sessions/ui/attempt-cell'
import { ElapsedCell } from '@/pages/activity-sessions/ui/elapsed-cell'
import { FinishedActions } from '@/pages/activity-sessions/ui/finished-actions'
import { GradeCell } from '@/pages/activity-sessions/ui/grade-cell'
import { FinishedStatus } from '@/pages/activity-sessions/ui/finished-status'
import { MomentCell } from '@/pages/activity-sessions/ui/moment-cell'
import { PageTimeCell } from '@/pages/activity-sessions/ui/page-time-cell'
import { ResultCell } from '@/pages/activity-sessions/ui/result-cell'
import { StudentCell } from '@/pages/activity-sessions/ui/student-cell'
import type { Assessment } from '@/shared/api/assessments'
import type { RosterEntry } from '@/shared/api/sessions'
import type { Column } from '@/shared/ui/data-table-column'
import { IdentitySkeleton } from '@/shared/ui/identity-skeleton'

export type RosterColumnsOptions = {
  assessment: Assessment
  canAct: boolean
  onInspect: (entry: RosterEntry) => void
}

export type FinishedColumnsOptions = RosterColumnsOptions & {
  /** Opens the attempt's submitted code. */
  onOpen: (entry: RosterEntry) => void
  /** Opens the grading sheet of the student. */
  onGrade: (entry: RosterEntry) => void
}

/** Columns of the finished table. Every row there has a session. */
export function useFinishedColumns({ assessment, canAct, onInspect, onOpen, onGrade }: FinishedColumnsOptions): Column<RosterEntry>[] {
  return [
    { id: 'name', header: 'Estudante', sortKey: 'name', className: 'min-w-60', cell: (entry) => <StudentCell entry={entry} />, skeleton: <IdentitySkeleton /> },
    { id: 'attempt', header: 'Tentativa', sortKey: 'attempt', hideBelow: 'md', cell: (entry) => <AttemptCell attempt={entry.attempt} /> },
    { id: 'finishedAt', header: 'Enviado em', sortKey: 'finishedAt', hideBelow: 'sm', cell: (entry) => <MomentCell at={entry.session?.finishedAt} /> },
    { id: 'result', header: 'Resultado', hideBelow: 'lg', cell: (entry) => <ResultCell assessmentId={assessment.id} studentProfileId={entry.studentProfileId} /> },
    { id: 'grade', header: 'Nota', hideBelow: 'sm', cell: (entry) => <GradeCell assessmentId={assessment.id} studentProfileId={entry.studentProfileId} /> },
    { id: 'status', header: 'Status', cell: (entry) => (entry.session ? <FinishedStatus session={entry.session} /> : null) },
    { id: 'elapsed', header: 'Tempo decorrido', sortKey: 'elapsedSeconds', hideBelow: 'md', cell: (entry) => <ElapsedCell seconds={entry.elapsedSeconds} /> },
    {
      id: 'openSeconds',
      header: 'Com a página aberta',
      sortKey: 'openSeconds',
      hideBelow: 'lg',
      cell: (entry) => <PageTimeCell elapsedSeconds={entry.elapsedSeconds} openSeconds={entry.session?.openSeconds ?? null} />,
    },
    {
      id: 'actions',
      header: '',
      className: 'w-40 text-right',
      cell: (entry) =>
        entry.session ? (
          <FinishedActions
            assessment={assessment}
            canAct={canAct}
            name={studentName(entry)}
            onInspect={() => onInspect(entry)}
            onGrade={() => onGrade(entry)}
            onOpen={() => onOpen(entry)}
            session={entry.session}
          />
        ) : null,
      skeleton: <span />,
    },
  ]
}
