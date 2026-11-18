import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { formatGrade } from '@/entities/assessment'
import { useCohortView } from '@/entities/cohort'
import { type Assessment, type AssessmentQuestion, deleteQuestion, swapQuestions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { LANGUAGE_LABEL } from '@/shared/editor/languages'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Markdown } from '@/shared/ui/markdown'
import { CodeDrafts } from '@/widgets/question-list/ui/code-drafts'

export function QuestionItem({
  assessment,
  question,
  questions,
  number,
  previous,
  next,
  manageable,
}: {
  assessment: Assessment
  question: AssessmentQuestion
  questions: AssessmentQuestion[]
  number: number
  previous?: AssessmentQuestion
  next?: AssessmentQuestion
  manageable: boolean
}) {
  const { cohort } = useCohortView()
  const [showCode, setShowCode] = useState(false)
  const free = Math.max(...questions.map((item) => item.position)) + 1

  const move = useMutation({
    mutationFn: (other: AssessmentQuestion) => swapQuestions(assessment.id, question, other, free),
    onError: (error) => toast.error(errorMessage(error)),
  })

  return (
    <li className="flex gap-4 px-4 py-4">
      <span
        aria-hidden
        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 font-semibold text-(--cohort-ink) text-xs tabular-nums"
      >
        {number}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
          <h3 className="font-semibold text-[14px] text-foreground tracking-[-0.01em]">
            <span className="sr-only">Questão {number}: </span>
            {question.title}
          </h3>
          <span className="font-medium text-foreground">{formatGrade(Number(question.maximumGrade))}</span>
          <span>{question.codeDrafts.map((draft) => LANGUAGE_LABEL[draft.language]).join(', ')}</span>
          {question.allowCopyPasting ? null : <span>Copiar e colar bloqueado</span>}
          {manageable ? (
            <div className="ml-auto flex items-center gap-0.5">
              <Button
                aria-label={`Mover questão ${number} para cima`}
                disabled={!previous || move.isPending}
                onClick={() => previous && move.mutate(previous)}
                size="icon-xs"
                variant="ghost-muted"
              >
                <ArrowUp />
              </Button>
              <Button
                aria-label={`Mover questão ${number} para baixo`}
                disabled={!next || move.isPending}
                onClick={() => next && move.mutate(next)}
                size="icon-xs"
                variant="ghost-muted"
              >
                <ArrowDown />
              </Button>
              <Button asChild size="icon-xs" variant="ghost-muted">
                <Link
                  aria-label={`Editar questão ${number}`}
                  params={{ cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug, questionSlug: question.slug }}
                  to="/classes/$cohortRef/activities/$assessmentSlug/questions/$questionSlug"
                >
                  <PencilLine />
                </Link>
              </Button>
              <ConfirmDialog
                action={() => deleteQuestion(assessment.id, question.id)}
                confirmLabel="Excluir"
                destructive
                notice={{ tone: 'irreversible' }}
                successMessage="Questão excluída."
                title={`Excluir a questão ${number}?`}
                trigger={
                  <Button aria-label={`Excluir questão ${number}`} size="icon-xs" variant="ghost-muted">
                    <Trash2 />
                  </Button>
                }
              />
            </div>
          ) : null}
        </div>

        <Markdown className="text-[13.5px]">{question.statement}</Markdown>

        <CodeDrafts drafts={question.codeDrafts} onToggle={() => setShowCode((open) => !open)} open={showCode} />
      </div>
    </li>
  )
}
