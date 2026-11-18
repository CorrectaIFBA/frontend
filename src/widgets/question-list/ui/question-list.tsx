import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ClipboardX, Plus } from 'lucide-react'
import { formatGrade } from '@/entities/assessment'
import { useCohortView, CohortNotice } from '@/entities/cohort'
import { type Assessment, questionsQueryOptions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'
import { Skeleton } from '@/shared/ui/skeleton'
import { QuestionItem } from '@/widgets/question-list/ui/question-item'

/*
  The activity's questions in the order students meet them. The number is
  the order, not the stored position, which can have gaps after removals.
*/
export function QuestionList({ assessment, manageable }: { assessment: Assessment; manageable: boolean }) {
  const { cohort } = useCohortView()
  const query = useQuery(questionsQueryOptions(assessment.id))
  const params = { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug }

  const addButton = manageable ? (
    <Button asChild size="xs" variant="outline">
      <Link params={params} to="/classes/$cohortRef/activities/$assessmentSlug/questions/new">
        <Plus /> Adicionar questão
      </Link>
    </Button>
  ) : null

  if (query.isError) {
    return (
      <Panel>
        <PanelHeading title="Questões" />
        <div className="p-4">
          <PanelNote>{errorMessage(query.error)}</PanelNote>
        </div>
      </Panel>
    )
  }

  if (query.isPending) {
    return (
      <Panel>
        <PanelHeading title="Questões" />
        <div className="flex flex-col gap-3 p-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Panel>
    )
  }

  const questions = query.data
  const total = questions.reduce((sum, question) => sum + Number(question.maximumGrade), 0)

  if (!questions.length) {
    return (
      <CohortNotice
        action={addButton}
        hint={
          manageable
            ? 'A atividade precisa de ao menos uma questão para ser publicada.'
            : 'Esta atividade ainda não tem questões.'
        }
        icon={ClipboardX}
        title="Nenhuma questão"
      />
    )
  }

  return (
    <Panel>
      <PanelHeading
        action={
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs tabular-nums">
              {questions.length} {questions.length === 1 ? 'questão' : 'questões'}, {formatGrade(total)}
            </span>
            {addButton}
          </div>
        }
        title="Questões"
      />
      <ol className="divide-y divide-border">
        {questions.map((question, index) => (
          <QuestionItem
            assessment={assessment}
            key={question.id}
            manageable={manageable}
            next={questions[index + 1]}
            number={index + 1}
            previous={questions[index - 1]}
            question={question}
            questions={questions}
          />
        ))}
      </ol>
    </Panel>
  )
}
