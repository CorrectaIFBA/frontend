import { getRouteApi } from "@tanstack/react-router";
import { PanelNote } from '@/shared/ui/panel-note'
import { useSolve, ConnectionStrip, QuestionWorkspace, SolveHeader } from '@/widgets/solve'
const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/solve/$questionSlug')

export function SolveQuestion() {
  const { questionSlug } = route.useParams()
  const { questions } = useSolve()
  const index = questions.findIndex((question) => question.slug === questionSlug)
  const question = questions[index]

  return (
    <>
      <SolveHeader currentQuestionId={question?.id} />
      <ConnectionStrip />
      {question ? (
        // Remounted per question, so each one keeps its own editor state and saved draft.
        <QuestionWorkspace key={question.id} number={index + 1} question={question} />
      ) : (
        <div className="m-auto w-full max-w-md p-4">
          <PanelNote>Questão não encontrada. Escolha outra no topo da página.</PanelNote>
        </div>
      )}
    </>
  )
}
