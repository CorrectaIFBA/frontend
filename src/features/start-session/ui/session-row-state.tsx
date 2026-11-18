import { useRemaining, LateStatus, Remaining, SessionStatus } from '@/entities/session'
import type { Assessment } from '@/shared/api/assessments'

/*
  On the cohort's activity list: where the student's attempt stands, under
  the title. The action sits apart, on the facts line (see
  `SessionRowAction`).
*/
export function SessionRowState({ assessment }: { assessment: Assessment }) {
  const session = assessment.mySession
  const remaining = useRemaining(session)
  if (!session) return null

  return (
    <>
      <SessionStatus state={session.state} />
      {session.late ? <LateStatus /> : null}
      {remaining !== null ? (
        <span className="text-muted-foreground text-xs">
          restam <Remaining ms={remaining} />
        </span>
      ) : null}
    </>
  )
}
