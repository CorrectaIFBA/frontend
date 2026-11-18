import { FinishedSession } from '@/features/start-session/ui/finished-session'
import { NotStarted } from '@/features/start-session/ui/not-started'
import type { Assessment } from '@/shared/api/assessments'

/*
  The student's side of an activity page: before the session, what starting
  means and the button; after it, how it ended. While it runs the student
  never sees this page, the route sends them to the coding page.
*/
export function SessionCard({ assessment }: { assessment: Assessment }) {
  const session = assessment.mySession

  if (session && session.state !== 'IN_PROGRESS') return <FinishedSession assessment={assessment} />
  return <NotStarted assessment={assessment} />
}
