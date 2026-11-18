import { Archive, Play, RotateCcw } from 'lucide-react'
import { COHORT_STATE_LABEL, useCohortView } from '@/entities/cohort'
import { LIFECYCLE, STATE_MEANING } from '@/features/manage-cohort/config/cohort-lifecycle'
import { StatusAction } from '@/features/manage-cohort/ui/status-action'
import { cn } from '@/shared/lib/cn'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'

export function StatusPanel() {
  const { cohort, isOwner } = useCohortView()
  const position = LIFECYCLE.indexOf(cohort.status)

  return (
    <Panel>
      <PanelHeading title="Situação" />
      <div className="flex flex-col gap-4 p-4">
        <ol className="grid grid-cols-3 gap-1.5" aria-label="Ciclo da turma">
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
                {COHORT_STATE_LABEL[state]}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-muted-foreground text-xs leading-relaxed">{STATE_MEANING[cohort.status]}</p>

        {isOwner ? (
          <div className="flex flex-wrap gap-2">
            {cohort.status === 'DRAFT' ? (
              <StatusAction
                description="Estudantes e docentes passam a poder entrar por código ou convite."
                icon={Play}
                label="Ativar turma"
                notice={{ tone: 'attention', message: 'A turma não volta a ser rascunho. Depois de ativada, só pode ser arquivada.' }}
                success="Turma ativada."
                target="ACTIVE"
                title="Ativar turma?"
              />
            ) : null}
            {cohort.status === 'ARCHIVED' ? (
              <StatusAction
                description="A turma volta a aceitar membros e alterações."
                icon={RotateCcw}
                label="Reativar turma"
                success="Turma reativada."
                target="ACTIVE"
                title="Reativar turma?"
              />
            ) : (
              <StatusAction
                description="A turma fica somente leitura. Você pode reativá-la depois."
                destructive
                notice={{ tone: 'attention', message: 'Códigos e convites deixam de funcionar e ninguém mais entra na turma.' }}
                icon={Archive}
                label="Arquivar"
                success="Turma arquivada."
                target="ARCHIVED"
                title="Arquivar turma?"
              />
            )}
          </div>
        ) : (
          <PanelNote>Só o responsável pela turma muda a situação.</PanelNote>
        )}
      </div>
    </Panel>
  )
}
