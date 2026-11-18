import { useQuery } from '@tanstack/react-query'
import { QuestionEditor } from '@/features/edit-question'
import { TestcasePanel } from '@/features/manage-testcases'
import { type Assessment, questionsQueryOptions } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { PanelNote } from '@/shared/ui/panel-note'
import { Skeleton } from '@/shared/ui/skeleton'

/*
  The whole list is read: the question is found by its slug in it, and the
  heading says which number the question is.
*/
export function QuestionEditorPage({ assessment, questionSlug }: { assessment: Assessment; questionSlug: string }) {
  const questions = useQuery(questionsQueryOptions(assessment.id))
  const index = questions.data?.findIndex((question) => question.slug === questionSlug) ?? -1

  if (questions.isError) return <PanelNote>{errorMessage(questions.error)}</PanelNote>
  if (questions.isPending) return <Skeleton className="h-[520px] w-full rounded-lg" />
  if (index < 0) return <PanelNote>Questão não encontrada. Ela pode ter sido excluída ou mudado de endereço.</PanelNote>

  const question = questions.data[index]
  return (
    <>
      <QuestionEditor
        assessment={assessment}
        // A save elsewhere refetches the list; remounting picks up the new values.
        key={question.updatedAt}
        number={index + 1}
        question={question}
      />
      {/* Saved on their own, apart from the question form above. */}
      <TestcasePanel assessmentId={assessment.id} questionId={question.id} />
    </>
  )
}
