import { useQuery } from '@tanstack/react-query'
import { Archive, RotateCcw, Send } from 'lucide-react'
import { ASSESSMENT_STATE_LABEL } from '@/entities/assessment'
import { LIFECYCLE, STATE_MEANING } from '@/features/manage-assessment/config/assessment-lifecycle'
import { archiveAssessment, type Assessment, publishAssessment, questionsQueryOptions } from '@/shared/api/assessments'
import { sessionCountsQueryOptions } from '@/shared/api/sessions'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'

export function AssessmentStatusPanel({ assessment, manageable }: { assessment: Assessment; manageable: boolean }) {
  const position = LIFECYCLE.indexOf(assessment.state)
  // Shares the question list's cache; the service refuses to publish an activity without questions.
  const questions = useQuery(questionsQueryOptions(assessment.id))
  const empty = questions.data?.length === 0
  // Archiving ends running attempts, so the dialog counts them.
  const counts = useQuery({ ...sessionCountsQueryOptions(assessment.id), enabled: assessment.state === 'PUBLISHED' })
  const running = counts.data?.IN_PROGRESS ?? 0

  return (
    <Panel>
      <PanelHeading title="Situação" />
      <div className="flex flex-col gap-4 p-4">
        <ol aria-label="Ciclo da atividade" className="grid grid-cols-3 gap-1.5">
          {LIFECYCLE.map((state, index) => (
            <li className="flex flex-col gap-1.5" key={state}>
              <span
                className={cn(
                  'h-1 rounded-full',
                  index < position && 'bg-(--cohort-ink) opacity-35',
                  index === position && 'bg-(--cohort-ink)',
                  index > position && 'bg-border'
                )}
              />
              <span
                aria-current={index === position ? 'step' : undefined}
                className={cn('text-xs', index === position ? 'font-medium text-foreground' : 'text-muted-foreground')}
              >
                {ASSESSMENT_STATE_LABEL[state]}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-muted-foreground text-xs leading-relaxed">{STATE_MEANING[assessment.state]}</p>

        {manageable && empty && assessment.state !== 'PUBLISHED' ? (
          <PanelNote tone="warning">Adicione ao menos uma questão para publicar.</PanelNote>
        ) : null}

        {manageable ? (
          <div className="flex flex-wrap gap-2">
            {assessment.state !== 'PUBLISHED' && !empty ? (
              <ConfirmDialog
                action={() => publishAssessment(assessment.id)}
                confirmLabel="Publicar"
                description={
                  assessment.state === 'DRAFT'
                    ? 'Os estudantes da turma passam a ver a atividade e o prazo de entrega.'
                    : 'A atividade volta a aparecer para os estudantes da turma.'
                }
                notice={
                  assessment.state === 'DRAFT'
                    ? { tone: 'attention', message: 'A atividade não volta a ser rascunho. Para escondê-la depois, arquive.' }
                    : undefined
                }
                successMessage="Atividade publicada."
                title={assessment.state === 'DRAFT' ? 'Publicar atividade?' : 'Publicar de novo?'}
                trigger={
                  <Button size="sm">
                    {assessment.state === 'DRAFT' ? <Send /> : <RotateCcw />}
                    {assessment.state === 'DRAFT' ? 'Publicar' : 'Publicar de novo'}
                  </Button>
                }
              />
            ) : null}
            {assessment.state !== 'ARCHIVED' ? (
              <ConfirmDialog
                action={() => archiveAssessment(assessment.id)}
                confirmLabel="Arquivar"
                description="Os estudantes deixam de ver a atividade. Você pode publicá-la de novo depois."
                destructive
                notice={
                  running
                    ? {
                        tone: 'irreversible',
                        message: `${
                          running === 1
                            ? '1 tentativa em andamento será encerrada agora.'
                            : `${running} tentativas em andamento serão encerradas agora.`
                        } Vale o que cada estudante já enviou.`,
                      }
                    : undefined
                }
                successMessage="Atividade arquivada."
                title="Arquivar atividade?"
                trigger={
                  <Button size="sm" variant="destructive-outline">
                    <Archive /> Arquivar
                  </Button>
                }
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </Panel>
  )
}
