import { Navigate, getRouteApi } from '@tanstack/react-router'
import { useCohortView } from '@/entities/cohort'
import { QuestionEditorPage } from '@/pages/question-editor/ui/question-editor-page'
import { QuestionPage } from '@/pages/question-editor/ui/question-page'
import { cohortAddress } from '@/shared/api/cohorts'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/questions/$questionSlug')

export function EditQuestion() {
  const { assessmentSlug, questionSlug } = route.useParams()
  const { cohort } = useCohortView()

  return (
    <QuestionPage assessmentSlug={assessmentSlug}>
      {(assessment, manageable) =>
        manageable ? (
          <QuestionEditorPage assessment={assessment} questionSlug={questionSlug} />
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
