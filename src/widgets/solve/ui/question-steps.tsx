import { nextQuestion, previousQuestion, type QuestionNavigation } from '@/widgets/solve/model/question-navigation'
import { QuestionStepCard } from '@/widgets/solve/ui/question-step-card'

/*
  Under the statement, pinned: the previous and next questions, named, so a
  student finds the way on without the header.
*/
export function QuestionSteps({ navigation }: { navigation: QuestionNavigation }) {
  const previous = previousQuestion(navigation)
  const next = nextQuestion(navigation)

  if (!previous && !next) return null

  return (
    <nav aria-label="Navegar entre questões" className="grid shrink-0 grid-cols-2 gap-2 border-border border-t bg-background px-5 py-3">
      {previous ? <QuestionStepCard direction="previous" number={navigation.currentIndex} onGo={navigation.goTo} question={previous} /> : <span />}
      {next ? <QuestionStepCard direction="next" number={navigation.currentIndex + 2} onGo={navigation.goTo} question={next} /> : null}
    </nav>
  )
}
