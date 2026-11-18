import { useGradeForm } from '@/features/grade-attempt/model/use-grade-form'
import type { QuestionGrade } from '@/shared/api/grades'
import { Button } from '@/shared/ui/button'
import { FormAlert } from '@/shared/ui/form-alert'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { gradeFormat } from '@/entities/grade'
import { percentFormat } from '@/entities/evaluation'
import { Sparkles } from 'lucide-react'

export type GradeFormProps = {
  assessmentId: string
  questionId: string
  studentProfileId: string
  maximumGrade: number
  grade: QuestionGrade | undefined
  /** Share of the question's test cases passed, 0 to 100; `null` without a result. */
  testcasePercentage: number | null
  onDone: () => void
}

/** The grade and comment of one question, new or edited. */
export function GradeForm({ assessmentId, questionId, studentProfileId, maximumGrade, grade, testcasePercentage, onDone }: GradeFormProps) {
  const form = useGradeForm({ assessmentId, questionId, studentProfileId, maximumGrade, grade, onSaved: onDone })
  const scoreId = `grade-score-${questionId}`
  const commentId = `grade-comment-${questionId}`

  return (
    <form
      className="flex flex-col gap-3 rounded-md border border-border-strong bg-card px-3.5 py-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (form.canSave) form.save()
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={scoreId}>Nota</Label>
        <div className="flex items-center gap-2">
          <Input
            aria-describedby={form.scoreError ? `${scoreId}-error` : undefined}
            aria-invalid={Boolean(form.scoreError)}
            autoFocus
            className="w-24 text-right tabular-nums"
            id={scoreId}
            inputMode="decimal"
            onChange={(event) => form.setScoreText(event.target.value)}
            placeholder="0"
            value={form.scoreText}
          />
          <span className="text-muted-foreground text-xs">de {gradeFormat.format(maximumGrade)}</span>
          {testcasePercentage !== null ? (
            <Button
              className="ml-auto"
              onClick={() => form.suggestFromTestcases(testcasePercentage)}
              size="sm"
              title="Preenche a nota com a mesma porcentagem dos casos de teste"
              type="button"
              variant="outline"
            >
              <Sparkles /> Usar {percentFormat.format(testcasePercentage)}% dos testes
            </Button>
          ) : null}
        </div>
        {form.scoreError ? (
          <p className="text-destructive text-xs" id={`${scoreId}-error`}>
            {form.scoreError}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={commentId}>Comentário</Label>
        <Textarea
          id={commentId}
          onChange={(event) => form.setComment(event.target.value)}
          placeholder="O que o estudante acertou e o que pode melhorar"
          value={form.comment}
        />
      </div>
      <FormAlert message={form.saveError} />
      <div className="flex justify-end gap-2">
        <Button onClick={onDone} size="sm" type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!form.canSave} size="sm" type="submit">
          {form.isSaving ? 'Salvando…' : 'Salvar nota'}
        </Button>
      </div>
    </form>
  )
}
