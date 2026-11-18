import { useQuestionEditor } from '@/features/edit-question/model/use-question-editor'
import { CodePanel } from '@/features/edit-question/ui/code-panel'
import { GradeChangeDialog } from '@/features/edit-question/ui/grade-change-dialog'
import { GradingPanel } from '@/features/edit-question/ui/grading-panel'
import { IdentificationPanel } from '@/features/edit-question/ui/identification-panel'
import { LeaveDialog } from '@/features/edit-question/ui/leave-dialog'
import { QuestionEditorHeader } from '@/features/edit-question/ui/question-editor-header'
import { StatementPanel } from '@/features/edit-question/ui/statement-panel'
import type { Assessment, AssessmentQuestion } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { FormAlert } from '@/shared/ui/form-alert'

type QuestionEditorProps = {
  assessment: Assessment
  question?: AssessmentQuestion
  /** The question's place in the activity, for the heading. */
  number: number
}

/*
  Writing one question: the statement on the left; on the right the
  languages the student may answer in, and for each the code they start
  from, in an editor that knows the language.
  Used for a new question (no `question`) and for editing one.
*/
export function QuestionEditor({ assessment, question, number }: QuestionEditorProps) {
  const editor = useQuestionEditor(assessment, question)
  const { form, mutation, blocker, submit, gradeChange } = editor

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={form.handleSubmit(submit)}
    >
      <QuestionEditorHeader assessment={assessment} editor={editor} number={number} question={question} />

      <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="flex flex-col gap-4">
          <IdentificationPanel assessment={assessment} form={form} isNew={!question} />
          <StatementPanel form={form} />
          <GradingPanel form={form} />
        </div>

        <CodePanel editor={editor} />
      </div>

      <LeaveDialog blocker={blocker} />
      <GradeChangeDialog
        error={gradeChange.pending && mutation.isError ? errorMessage(mutation.error) : null}
        isSaving={mutation.isPending}
        onCancel={gradeChange.cancel}
        onConfirm={gradeChange.confirm}
        pending={gradeChange.pending}
      />
    </form>
  )
}
