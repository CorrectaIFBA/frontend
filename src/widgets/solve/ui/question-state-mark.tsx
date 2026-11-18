import { cn } from '@/shared/lib/cn'

/** Where a question stands: its code sent for grading, code of the student's own, or none. */
export type QuestionState = 'sent' | 'written' | 'empty'

export const QUESTION_STATE_LABEL: Record<QuestionState, string> = {
  sent: 'Enviada',
  written: 'Com código',
  empty: 'Sem código',
}

type QuestionStateMarkProps = {
  state: QuestionState
  /** Also writes the state beside the dot. */
  showsLabel?: boolean
}

/*
  A dot for the state: green once sent, amber while only written, hollow when
  empty. No cohort colour: the question menu renders outside the cohort's scope.
*/
export function QuestionStateMark({ state, showsLabel = false }: QuestionStateMarkProps) {
  const dot = (
    <span
      aria-hidden
      className={cn(
        'size-2 shrink-0 rounded-full',
        state === 'sent' ? 'bg-success' : state === 'written' ? 'bg-warning' : 'border border-muted-foreground/50'
      )}
    />
  )

  if (!showsLabel) return dot

  return (
    <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground text-xs">
      {dot}
      {QUESTION_STATE_LABEL[state]}
    </span>
  )
}
