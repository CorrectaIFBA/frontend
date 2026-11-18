import { AccountAvatar } from '@/entities/profile'
import { studentName } from '@/pages/activity-sessions/lib/student-name'
import type { RosterEntry } from '@/shared/api/sessions'

export type StudentCellProps = { entry: RosterEntry }

/** The name is what faculty scan for, so it wraps instead of being cut. */
export function StudentCell({ entry }: StudentCellProps) {
  const name = studentName(entry)

  return (
    <span className="flex items-center gap-3 py-2">
      <AccountAvatar className="size-8 shrink-0" name={name} type="STUDENT" variant="soft" />
      <span className="grid gap-0.5 leading-tight">
        <span className="text-pretty font-medium text-foreground">{name}</span>
        {entry.currentMember ? null : <span className="text-muted-foreground text-xs">Saiu da turma</span>}
      </span>
    </span>
  )
}
