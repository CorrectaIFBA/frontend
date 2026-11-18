import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

type QuestionStepButtonProps = {
  direction: 'previous' | 'next'
  question: AssessmentQuestion | undefined
  onGo: (question: AssessmentQuestion) => void
}

/** An arrow beside the switcher; at either end it stays, disabled, and says why. */
export function QuestionStepButton({ direction, question, onGo }: QuestionStepButtonProps) {
  const label = direction === 'previous' ? 'Questão anterior' : 'Próxima questão'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* A disabled button gets no pointer events; the wrapper keeps the tooltip. */}
        <span className="inline-flex" tabIndex={question ? -1 : 0}>
          <Button aria-label={label} disabled={!question} onClick={() => question && onGo(question)} size="icon-sm" variant="ghost">
            {direction === 'previous' ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        {question ? `${label}: ${question.title}` : direction === 'previous' ? 'Esta é a primeira questão' : 'Esta é a última questão'}
      </TooltipContent>
    </Tooltip>
  )
}
