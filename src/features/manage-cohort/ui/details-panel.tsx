import { useCohortView } from '@/entities/cohort'
import { DetailsForm } from '@/features/manage-cohort/ui/details-form'
import { FactList } from '@/shared/ui/fact-list'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'

export function DetailsPanel() {
  const { cohort, isOwner } = useCohortView()
  const editable = isOwner && cohort.status !== 'ARCHIVED'

  return (
    <Panel>
      <PanelHeading title="Detalhes" />
      {editable ? (
        <DetailsForm />
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          <FactList
            facts={[
              { label: 'Nome', value: cohort.name },
              { label: 'Endereço', value: <span className="font-mono">/{cohort.slug}</span> },
              {
                label: 'Descrição',
                value: cohort.description || <span className="text-muted-foreground">Sem descrição.</span>,
              },
            ]}
          />
          <div className="px-4">
            <PanelNote>
              {isOwner
                ? 'Reative a turma para editar os detalhes.'
                : 'Só o responsável pela turma altera os detalhes.'}
            </PanelNote>
          </div>
        </div>
      )}
    </Panel>
  )
}
