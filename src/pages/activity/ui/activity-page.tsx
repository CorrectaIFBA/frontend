import { useQuery } from '@tanstack/react-query'
import { Navigate, getRouteApi } from '@tanstack/react-router'
import { PencilLine } from 'lucide-react'
import { dueFormat, AssessmentFacts, AssessmentStatus, DueLeaf, DueNote } from '@/entities/assessment'
import { useCohortView } from '@/entities/cohort'
import { AssessmentStatusPanel, EditAssessmentDialog, RulesPanel } from '@/features/manage-assessment'
import { SessionCard, ViewSubmissionButton } from '@/features/start-session'
import { ActivitySkeleton } from '@/pages/activity/ui/activity-skeleton'
import { assessmentBySlugQueryOptions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import { BackLink } from '@/shared/ui/back-link'
import { Button } from '@/shared/ui/button'
import { FactList } from '@/shared/ui/fact-list'
import { Markdown } from '@/shared/ui/markdown'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'
import { QuestionList } from '@/widgets/question-list'
import { SessionsPanel } from '@/widgets/sessions-panel'

const route = getRouteApi('/_app/classes/$cohortRef/activities/$assessmentSlug/')

/*
  One activity inside its cohort: the instructions on the left, and on the
  right what governs it — when it is visible and how it is taken. Students
  read the rules under the instructions and see their attempt on the right.
*/
export function ActivityPage() {
  const { assessmentSlug } = route.useParams()
  const { cohort, isFaculty } = useCohortView()
  // Always re-read on arrival: this page redirects on `mySession`, and a stale copy bounces the student around.
  const query = useQuery({ ...assessmentBySlugQueryOptions(cohort.id, assessmentSlug), refetchOnMount: 'always' })
  const back = (
    <BackLink label="Atividades" params={{ cohortRef: cohortAddress(cohort) }} to="/classes/$cohortRef" />
  )

  if (query.isError) {
    return (
      <div className="flex flex-col gap-4">
        {back}
        <PanelNote>{errorMessage(query.error)}</PanelNote>
      </div>
    )
  }

  if (query.isPending) return <ActivitySkeleton />

  const assessment = query.data
  // The service lets any of the cohort's faculty manage its activities, but only while the cohort is active.
  const manageable = isFaculty && cohort.status === 'ACTIVE'

  // While the attempt runs, the student belongs on the coding page; decided only on a fresh answer.
  if (assessment.mySession?.state === 'IN_PROGRESS') {
    if (query.isFetching) return <ActivitySkeleton />
    return (
      <Navigate
        params={{ cohortRef: cohortAddress(cohort), assessmentSlug }}
        replace
        to="/classes/$cohortRef/activities/$assessmentSlug/solve"
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {back}

      <div className="flex flex-wrap items-start gap-4">
        <DueLeaf assessment={assessment} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="font-semibold text-[20px] leading-tight tracking-[-0.03em]">{assessment.title}</h2>
            {isFaculty ? <AssessmentStatus state={assessment.state} /> : null}
            {/* A running attempt redirected above, so a session here has ended. */}
            <DueNote assessment={assessment} revealLate={isFaculty} submitted={Boolean(assessment.mySession)} />
          </div>
          <p className="text-muted-foreground text-xs">
            {assessment.dueDate ? (
              <time dateTime={assessment.dueDate}>Entrega até {dueFormat.format(new Date(assessment.dueDate))}</time>
            ) : (
              'Sem prazo de entrega'
            )}
          </p>
          <AssessmentFacts assessment={assessment} className="mt-1" showQuestionCount={isFaculty} />
        </div>
        {manageable ? (
          <EditAssessmentDialog
            assessment={assessment}
            trigger={
              <Button size="sm" variant="outline">
                <PencilLine /> Editar
              </Button>
            }
          />
        ) : null}
        {isFaculty ? null : <ViewSubmissionButton assessment={assessment} />}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeading title="Instruções" />
            {assessment.description ? (
              <Markdown className="max-w-prose p-4 text-[14px]">{assessment.description}</Markdown>
            ) : (
              <p className="p-4 text-muted-foreground text-xs">
                {manageable ? 'Sem instruções. Use Editar para explicar o que entregar.' : 'Sem instruções.'}
              </p>
            )}
          </Panel>
          {isFaculty ? <QuestionList assessment={assessment} manageable={manageable} /> : null}
          {/* Students read the rules right after the instructions; their attempt takes the right column. */}
          {isFaculty ? null : <RulesPanel assessment={assessment} forStudent manageable={false} />}
          {isFaculty ? (
            <Panel>
              <PanelHeading title="Histórico" />
              <FactList
                facts={[
                  {
                    label: 'Criada',
                    value: <span title={dateTimeFormat.format(new Date(assessment.createdAt))}>{relativeDate(assessment.createdAt)}</span>,
                  },
                  {
                    label: 'Última alteração',
                    value: <span title={dateTimeFormat.format(new Date(assessment.updatedAt))}>{relativeDate(assessment.updatedAt)}</span>,
                  },
                ]}
              />
            </Panel>
          ) : null}
        </div>
        <div className="flex flex-col gap-4">
          {isFaculty ? <AssessmentStatusPanel assessment={assessment} manageable={manageable} /> : null}
          {isFaculty && assessment.state !== 'DRAFT' ? <SessionsPanel assessment={assessment} /> : null}
          {isFaculty ? <RulesPanel assessment={assessment} forStudent={false} manageable={manageable} /> : <SessionCard assessment={assessment} />}
          {isFaculty && !manageable ? (
            <PanelNote>
              {cohort.status === 'DRAFT'
                ? 'Ative a turma para publicar ou alterar esta atividade.'
                : 'A turma está arquivada: a atividade fica somente leitura.'}
            </PanelNote>
          ) : null}
        </div>
      </div>
    </div>
  )
}
