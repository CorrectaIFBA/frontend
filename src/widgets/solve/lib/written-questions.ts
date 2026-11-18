import type { DraftSyncer } from '@/entities/workspace'
import type { AssessmentQuestion } from '@/shared/api/assessments'

/** The code the student starts from in a question: its only allowed language for now. */
export function starterCode(question: AssessmentQuestion) {
  return question.codeDrafts[0]?.code ?? ''
}

export function writtenQuestions(syncers: Map<string, DraftSyncer>, questions: AssessmentQuestion[]) {
  return new Set(
    questions
      .filter((question) => {
        const draft = syncers.get(question.id)?.text()
        return draft != null && draft.code !== starterCode(question)
      })
      .map((question) => question.id)
  )
}
