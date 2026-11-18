import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { RunButton } from '@/features/run-code'
import { cohortAddress } from '@/shared/api/cohorts'
import { starterCode } from '@/widgets/solve/lib/written-questions'
import { useSolve } from '@/widgets/solve/model/solve-context'
import { Clock } from '@/widgets/solve/ui/clock'
import { Fuse } from '@/widgets/solve/ui/fuse'
import { useSolveNavigation } from '@/widgets/solve/model/use-solve-navigation'
import { QuestionSwitcher } from '@/widgets/solve/ui/question-switcher'
import { SolveQuestionMark } from '@/widgets/solve/ui/solve-question-mark'
import { SubmitDialog } from '@/widgets/solve/ui/submit-dialog'

/* ---------------------------------------------------------------------------
   Header. Everything the student needs while writing code and nothing else:
   the way out, the questions, how far along they
   are, the time left, and the submit button. Under it a fuse burns down
   with the time; it is the page's only ornament, and it carries the
   deadline at a glance.
--------------------------------------------------------------------------- */

export function SolveHeader({ currentQuestionId }: { currentQuestionId?: string }) {
  const { cohort, assessment, questions, coding, written, syncers } = useSolve()
  const { session } = coding
  const running = session.state === 'IN_PROGRESS'
  const current = questions.find((question) => question.id === currentQuestionId)
  const syncer = current ? syncers.get(current.id) : undefined
  const fallback = current ? { code: starterCode(current), language: current.codeDrafts[0]?.language ?? 'C' } : null
  const navigation = useSolveNavigation(currentQuestionId)

  return (
    <header className="relative z-20 shrink-0 border-border border-b bg-background">
      {/* Three columns, the outer two equal, so the actions sit at the true center whatever the title's length. */}
      <div className="grid h-12 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground"
            params={{ cohortRef: cohortAddress(cohort) }}
            title="Voltar para a turma; a atividade continua em andamento"
            to="/classes/$cohortRef"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Turma</span>
          </Link>
          <h1 className="min-w-0 truncate font-semibold text-[14px] tracking-[-0.01em]">{assessment.title}</h1>

          {questions.length > 1 ? (
            <QuestionSwitcher
              navigation={navigation}
              renderMark={(question, showsLabel) => (
                <SolveQuestionMark isWritten={written.has(question.id)} showsLabel={showsLabel} syncer={syncers.get(question.id)} />
              )}
            />
          ) : null}
        </div>

        <div aria-label="Ações" className="flex items-center gap-1.5" role="toolbar">
          {running && syncer && current && fallback ? (
            <>
              <RunButton fallback={fallback} syncer={syncer} />
              {/* Left of the rule acts on this question; right of it, on the whole activity. */}
              <span aria-hidden className="mx-1 h-5 w-px bg-border" />
            </>
          ) : null}
          {running ? <SubmitDialog /> : null}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          <span className="hidden truncate text-muted-foreground text-xs tabular-nums lg:inline">
            {written.size} de {questions.length} com código
          </span>
          <Clock />
        </div>
      </div>
      <Fuse />
    </header>
  )
}
