import { useQuery } from '@tanstack/react-query'
import { QuestionEditor } from '@/features/edit-question'
import { type Assessment, questionsQueryOptions } from '@/shared/api/assessments'

/* The list is read so the heading can say which number the new question gets. */
export function NewQuestionEditor({ assessment }: { assessment: Assessment }) {
  const questions = useQuery(questionsQueryOptions(assessment.id))
  return <QuestionEditor assessment={assessment} number={(questions.data?.length ?? 0) + 1} />
}
