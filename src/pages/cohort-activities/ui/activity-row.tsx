import { Link } from '@tanstack/react-router'
import { AssessmentFacts, AssessmentStatus, DueLeaf, DueNote } from '@/entities/assessment'
import { useCohortView } from '@/entities/cohort'
import { GradeBand, SessionRowAction, SessionRowState, SubmissionBand } from '@/features/start-session'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { Markdown } from '@/shared/ui/markdown'

export function ActivityRow({ assessment, showState }: { assessment: Assessment; showState: boolean }) {
  const { cohort, isFaculty } = useCohortView()
  const running = assessment.mySession?.state === 'IN_PROGRESS'
  const submitted = Boolean(assessment.mySession) && !running

  /*
    The title is the link, stretched over the whole row; links inside the
    instructions sit above it, since anchors cannot nest.
  */
  return (
    <div className="group relative flex gap-4 px-4 py-4 transition-colors hover:bg-accent/50 has-[[data-row-link]:focus-visible]:bg-accent/50">
      <DueLeaf assessment={assessment} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <Link
            className="font-medium text-[14px] leading-snug tracking-[-0.01em] after:absolute after:inset-0 focus-visible:outline-none group-hover:underline group-hover:decoration-border-strong group-hover:underline-offset-4"
            data-row-link=""
            params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug }}
            // A running attempt opens straight on the code; the activity page is for before and after it.
            to={
              running
                ? '/classes/$cohortRef/activities/$assessmentSlug/solve'
                : '/classes/$cohortRef/activities/$assessmentSlug'
            }
          >
            {assessment.title}
          </Link>
          {showState && assessment.state !== 'PUBLISHED' ? <AssessmentStatus state={assessment.state} /> : null}
          {running ? null : <DueNote assessment={assessment} revealLate={isFaculty} submitted={submitted} />}
        </div>
        {assessment.mySession ? (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <SessionRowState assessment={assessment} />
          </div>
        ) : null}
        {assessment.description ? (
          <Markdown className="max-w-prose text-[13px] text-muted-foreground">{assessment.description}</Markdown>
        ) : null}
        {isFaculty ? null : <GradeBand assessment={assessment} />}
        {isFaculty ? null : <SubmissionBand assessment={assessment} />}
        {/* The facts read left to right and end on the row's action, in the bottom-right corner. */}
        <div className="flex min-h-6 items-center gap-3">
          <AssessmentFacts assessment={assessment} className="min-w-0 flex-1" showQuestionCount={isFaculty} />
          {isFaculty ? null : (
            <div className="ml-auto shrink-0">
              <SessionRowAction assessment={assessment} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
