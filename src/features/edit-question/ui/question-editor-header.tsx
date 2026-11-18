import { LoaderCircle, Trash2 } from 'lucide-react'
import type { QuestionEditorState } from '@/features/edit-question/model/use-question-editor'
import { type Assessment, type AssessmentQuestion, deleteQuestion } from '@/shared/api/assessments'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

type QuestionEditorHeaderProps = {
  assessment: Assessment
  question?: AssessmentQuestion
  number: number
  editor: QuestionEditorState
}

export function QuestionEditorHeader({ assessment, question, number, editor }: QuestionEditorHeaderProps) {
  const { form, mutation, backToActivity } = editor

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-semibold text-[20px] tracking-[-0.03em]">
        {question ? `Questão ${number}: ${question.title}` : 'Nova questão'}
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {question ? (
          <ConfirmDialog
            action={async () => {
              await deleteQuestion(assessment.id, question.id)
              backToActivity()
            }}
            confirmLabel="Excluir"
            destructive
            notice={{ tone: 'irreversible' }}
            successMessage="Questão excluída."
            title={`Excluir a questão ${number}?`}
            trigger={
              <Button size="sm" type="button" variant="destructive-outline">
                <Trash2 /> Excluir
              </Button>
            }
          />
        ) : null}
        <Button onClick={backToActivity} size="sm" type="button" variant="outline">
          Cancelar
        </Button>
        <Button disabled={mutation.isPending || (question && !form.formState.isDirty)} size="sm" type="submit">
          {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
          {question ? 'Salvar questão' : 'Adicionar questão'}
        </Button>
      </div>
    </div>
  )
}
