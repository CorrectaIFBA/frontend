import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { nextQuestion, previousQuestion, type QuestionNavigation } from '@/widgets/solve/model/question-navigation'
import { QuestionStepButton } from '@/widgets/solve/ui/question-step-button'

type QuestionSwitcherProps = {
  navigation: QuestionNavigation
  /** The state of a question: a dot, and with `showsLabel` its name too. */
  renderMark: (question: AssessmentQuestion, showsLabel: boolean) => ReactNode
}

/*
  The header's way between questions. The middle names where the student is,
  "Questão 2 de 3" and its title, and opens the list of every question with
  its state; the arrows on each side step to the previous and next one.
*/
export function QuestionSwitcher({ navigation, renderMark }: QuestionSwitcherProps) {
  const { questions, currentIndex, goTo } = navigation
  const current = questions[currentIndex]
  const previous = previousQuestion(navigation)
  const next = nextQuestion(navigation)

  return (
    <nav aria-label="Questões" className="flex min-w-0 items-center gap-1">
      <QuestionStepButton direction="previous" onGo={goTo} question={previous} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="min-w-0 max-w-72 justify-start gap-2" size="sm" variant="outline">
            {current ? renderMark(current, false) : null}
            <span className="shrink-0 tabular-nums">
              Questão {currentIndex + 1} de {questions.length}
            </span>
            {current ? <span className="hidden min-w-0 truncate font-normal text-muted-foreground xl:inline">{current.title}</span> : null}
            <ChevronDown className="ml-auto text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80">
          <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">Ir para a questão</DropdownMenuLabel>
          {questions.map((question, index) => (
            <DropdownMenuItem
              className={cn('gap-2.5 py-2', index === currentIndex && 'bg-accent/60')}
              key={question.id}
              onSelect={() => goTo(question)}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-md border font-semibold text-xs tabular-nums',
                  // The menu renders outside the cohort's scope, so it cannot use the cohort's colour.
                  index === currentIndex ? 'border-foreground bg-foreground text-background' : 'border-border'
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate">{question.title}</span>
              {renderMark(question, true)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <QuestionStepButton direction="next" onGo={goTo} question={next} />
    </nav>
  )
}
