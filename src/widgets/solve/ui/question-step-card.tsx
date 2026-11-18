import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'

type QuestionStepCardProps = {
  direction: 'previous' | 'next'
  question: AssessmentQuestion
  number: number
  onGo: (question: AssessmentQuestion) => void
}

/** The previous or next question, named, as a large button. */
export function QuestionStepCard({ direction, question, number, onGo }: QuestionStepCardProps) {
  const isNext = direction === 'next'

  return (
    <button
      className={cn(
        'group flex min-w-0 cursor-pointer flex-col gap-0.5 rounded-lg border border-border px-3 py-2.5 transition-colors hover:border-(--cohort-ink)/50 hover:bg-(--cohort-ink)/6 focus-visible:outline-2 focus-visible:outline-(--cohort-ink) focus-visible:outline-offset-2',
        isNext ? 'col-start-2 items-end text-right' : 'items-start text-left'
      )}
      onClick={() => onGo(question)}
      type="button"
    >
      <span className="flex items-center gap-1 text-muted-foreground text-xs">
        {isNext ? null : <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />}
        {isNext ? 'Próxima' : 'Anterior'} · Questão {number}
        {isNext ? <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /> : null}
      </span>
      <span className="w-full truncate font-medium text-[13px]">{question.title}</span>
    </button>
  )
}
