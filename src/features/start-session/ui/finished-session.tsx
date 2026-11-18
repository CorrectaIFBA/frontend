import { useQuery } from '@tanstack/react-query'
import { formatDuration, LateStatus, SessionStatus } from '@/entities/session'
import { type Assessment, DEFAULT_PARAMETERS } from '@/shared/api/assessments'
import { errorMessage } from '@/shared/api/errors'
import { mySessionQueryOptions } from '@/shared/api/sessions'
import { dateTimeFormat } from '@/shared/lib/date-format'
import { FactList } from '@/shared/ui/fact-list'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'
import { MyGrades } from '@/features/start-session/ui/my-grades'
import { MyResultScore } from '@/features/start-session/ui/my-result-score'
import { SubmissionLinkRow } from '@/features/start-session/ui/submission-link-row'

export function FinishedSession({ assessment }: { assessment: Assessment }) {
  const query = useQuery(mySessionQueryOptions(assessment.id))
  const summary = assessment.mySession
  if (!summary) return null
  const session = query.data

  const facts = [
    { label: 'Iniciada', value: dateTimeFormat.format(new Date(summary.startedAt)) },
    ...(summary.finishedAt
      ? [
          { label: 'Encerrada', value: dateTimeFormat.format(new Date(summary.finishedAt)) },
          {
            label: 'Duração',
            value: formatDuration(
              Math.round((new Date(summary.finishedAt).getTime() - new Date(summary.startedAt).getTime()) / 1000)
            ),
          },
        ]
      : []),
  ]

  return (
    <Panel>
      <PanelHeading
        action={
          <div className="flex items-center gap-1.5">
            {summary.late ? <LateStatus /> : null}
            <SessionStatus state={summary.state} />
          </div>
        }
        title="Sua tentativa"
      />
      <FactList facts={facts} />
      {session && (assessment.parameters ?? DEFAULT_PARAMETERS).showAssignedGrades ? (
        <MyGrades assessmentId={assessment.id} studentProfileId={session.studentProfileId} />
      ) : null}
      <div className="border-border border-t p-4">
        {query.isError ? (
          <PanelNote>{errorMessage(query.error)}</PanelNote>
        ) : session ? (
          session.rules.canViewDefinitiveTestcaseScoringAfterSubmission ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-xs">Casos de teste aprovados</span>
              <MyResultScore assessmentId={assessment.id} />
            </div>
          ) : (
            <PanelNote>A pontuação ainda não foi liberada.</PanelNote>
          )
        ) : null}
      </div>
      <SubmissionLinkRow assessment={assessment} />
    </Panel>
  )
}
