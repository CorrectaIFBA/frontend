import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { parseScore } from '@/features/grade-attempt/lib/parse-score'
import { errorMessage } from '@/shared/api/errors'
import { type QuestionGrade, gradeQuestion } from '@/shared/api/grades'

const gradeInput = (score: number | null | undefined) => (score === null || score === undefined ? '' : String(score).replace('.', ','))

/** The grade and comment being typed for one question, checked against its maximum grade, and their saving. */
export function useGradeForm({
  assessmentId,
  questionId,
  studentProfileId,
  maximumGrade,
  grade,
  onSaved,
}: {
  assessmentId: string
  questionId: string
  studentProfileId: string
  maximumGrade: number
  grade: QuestionGrade | undefined
  onSaved: () => void
}) {
  const [scoreText, setScoreText] = useState(gradeInput(grade?.score))
  const [comment, setComment] = useState(grade?.comment ?? '')
  const score = parseScore(scoreText)

  const scoreError = Number.isNaN(score)
    ? 'Use um número com até duas casas decimais.'
    : score !== null && score > maximumGrade
      ? `A nota vai até ${gradeInput(maximumGrade)}.`
      : null

  const mutation = useMutation({
    mutationFn: () => gradeQuestion(assessmentId, questionId, studentProfileId, { score, comment: comment.trim() || null }),
    onSuccess: () => {
      toast.success('Nota salva.')
      onSaved()
    },
  })

  return {
    scoreText,
    setScoreText,
    comment,
    setComment,
    scoreError,
    canSave: score !== null && !scoreError && !mutation.isPending,
    isSaving: mutation.isPending,
    saveError: mutation.error ? errorMessage(mutation.error) : null,
    save: () => mutation.mutate(),
    /** Fills the grade with the same share of the question as the test cases passed, two decimals. */
    suggestFromTestcases: (percentage: number) =>
      setScoreText(gradeInput(Math.round(((percentage / 100) * maximumGrade) * 100) / 100)),
  }
}
