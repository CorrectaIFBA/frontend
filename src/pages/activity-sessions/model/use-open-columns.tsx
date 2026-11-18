import type { RosterColumnsOptions } from '@/pages/activity-sessions/model/use-finished-columns'
import { studentName } from '@/pages/activity-sessions/lib/student-name'
import { AttemptCell } from '@/pages/activity-sessions/ui/attempt-cell'
import { ElapsedCell } from '@/pages/activity-sessions/ui/elapsed-cell'
import { MomentCell } from '@/pages/activity-sessions/ui/moment-cell'
import { OpenActions } from '@/pages/activity-sessions/ui/open-actions'
import { OpenStatus } from '@/pages/activity-sessions/ui/open-status'
import { PageTimeCell } from '@/pages/activity-sessions/ui/page-time-cell'
import { RemainingCell } from '@/pages/activity-sessions/ui/remaining-cell'
import { StudentCell } from '@/pages/activity-sessions/ui/student-cell'
import type { RosterEntry } from '@/shared/api/sessions'
import type { Column } from '@/shared/ui/data-table-column'
import { IdentitySkeleton } from '@/shared/ui/identity-skeleton'

/** Columns of the open table: running sessions, then students who have not started. */
export function useOpenColumns({ assessment, canAct, onInspect }: RosterColumnsOptions): Column<RosterEntry>[] {
  return [
    { id: 'name', header: 'Estudante', sortKey: 'name', className: 'min-w-60', cell: (entry) => <StudentCell entry={entry} />, skeleton: <IdentitySkeleton /> },
    { id: 'attempt', header: 'Tentativa', sortKey: 'attempt', hideBelow: 'md', cell: (entry) => <AttemptCell attempt={entry.attempt} /> },
    { id: 'status', header: 'Status', cell: (entry) => <OpenStatus session={entry.session} /> },
    { id: 'startedAt', header: 'Iniciou em', sortKey: 'startedAt', hideBelow: 'sm', cell: (entry) => <MomentCell at={entry.session?.startedAt} /> },
    { id: 'remaining', header: 'Restam', hideBelow: 'md', cell: (entry) => <RemainingCell session={entry.session} /> },
    { id: 'elapsed', header: 'Tempo decorrido', sortKey: 'elapsedSeconds', hideBelow: 'lg', cell: (entry) => <ElapsedCell seconds={entry.elapsedSeconds} /> },
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
      className: 'w-32 text-right',
      cell: (entry) =>
        entry.session ? (
          <OpenActions
            assessment={assessment}
            canAct={canAct}
            name={studentName(entry)}
            onInspect={() => onInspect(entry)}
            session={entry.session}
          />
        ) : null,
      skeleton: <span />,
    },
  ]
}
