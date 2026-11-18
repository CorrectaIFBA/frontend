import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { LateStatus, SessionStatus } from '@/entities/session'
import type { SessionSummary } from '@/shared/api/sessions'
import { dateTimeFormat } from '@/shared/lib/date-format'
import type { AttemptResult } from '@/widgets/solve/lib/attempt-result'
import { AttemptResultBadge } from '@/widgets/solve/ui/attempt-result-badge'
import type { QuestionNavigation } from '@/widgets/solve/model/question-navigation'
import { QuestionStateMark } from '@/widgets/solve/ui/question-state-mark'
import { QuestionSwitcher } from '@/widgets/solve/ui/question-switcher'

type ReviewHeaderProps = {
  title: string
  navigation: QuestionNavigation
  submittedQuestionIds: Set<string>
  session: Pick<SessionSummary, 'state' | 'finishedAt' | 'late'>
  /** The way out, left of the title. */
  backLink: ReactNode
  /** Whose answers these are, in the middle. */
  owner: ReactNode
  /** The attempt's final evaluation, on the right; `null` while it loads. */
  attempt: AttemptResult | null
  /** The activity hides the score from the student. */
  isScoreHidden: boolean
  /** Buttons beside the owner, at the center, like the coding page's dock. */
  actions?: ReactNode
}

/* The coding page's header, read-only: the questions, whose answers, and when they were handed in. */
export function ReviewHeader({
  title,
  navigation,
  submittedQuestionIds,
  session,
  backLink,
  owner,
  attempt,
  isScoreHidden,
  actions,
}: ReviewHeaderProps) {
  return (
    <header className="shrink-0 border-border border-b bg-background">
      <div className="grid h-12 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          {backLink}
          <h1 className="min-w-0 truncate font-semibold text-[14px] tracking-[-0.01em]">{title}</h1>
          {navigation.questions.length > 1 ? (
            <QuestionSwitcher
              navigation={navigation}
              renderMark={(question, showsLabel) => (
                <QuestionStateMark showsLabel={showsLabel} state={submittedQuestionIds.has(question.id) ? 'sent' : 'empty'} />
              )}
            />
          ) : null}
        </div>

        <div className="flex min-w-0 items-center gap-2 text-[13px]">
          <Lock aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
          {owner}
          {actions ? (
            <div aria-label="Ações" className="flex shrink-0 items-center gap-1.5" role="toolbar">
              {/* Left of the rule, whose answers these are; right of it, what faculty do with them. */}
              <span aria-hidden className="mx-1 h-5 w-px bg-border" />
              {actions}
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2">
          {isScoreHidden ? (
            <span className="text-muted-foreground text-xs">Pontuação não liberada</span>
          ) : (
            <AttemptResultBadge attempt={attempt} />
          )}
          {session.finishedAt ? (
            <span className="hidden truncate text-muted-foreground text-xs tabular-nums lg:inline">
              Encerrada em {dateTimeFormat.format(new Date(session.finishedAt))}
            </span>
          ) : null}
          {session.late ? <LateStatus /> : null}
          <SessionStatus state={session.state} />
        </div>
      </div>
    </header>
  )
}
