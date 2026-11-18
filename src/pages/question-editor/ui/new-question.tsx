import { Navigate, getRouteApi } from '@tanstack/react-router'
import { useCohortView } from '@/entities/cohort'
import { NewQuestionEditor } from '@/pages/question-editor/ui/new-question-editor'
import { QuestionPage } from '@/pages/question-editor/ui/question-page'
import { cohortAddress } from '@/shared/api/cohorts'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/questions/new')

export function NewQuestion() {
  const { assessmentSlug } = route.useParams()
  const { cohort } = useCohortView()

  return (
    <QuestionPage assessmentSlug={assessmentSlug}>
      {(assessment, manageable) =>
        manageable ? (
          <NewQuestionEditor assessment={assessment} />
        ) : (
          <Navigate
            params={{ cohortRef: cohortAddress(cohort), assessmentSlug }}
            replace
            to="/classes/$cohortRef/activities/$assessmentSlug"
          />
        )
      }
    </QuestionPage>
  )
}
