import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { useCohortView } from '@/entities/cohort'
import { deleteCohort } from '@/shared/api/cohorts'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

/* ---------------------------------------------------------------------------
   Delete
--------------------------------------------------------------------------- */

export function DeletePanel() {
  const { cohort } = useCohortView()
  const navigate = useNavigate()

  return (
    <Panel className="border-destructive/25">
      <PanelHeading title="Excluir turma" />
      <div className="flex flex-col gap-3 p-4">
        <p className="text-muted-foreground text-xs leading-relaxed">
          A exclusão é definitiva. Turmas já ativadas só podem ser arquivadas.
        </p>
        <ConfirmDialog
          action={async () => {
            await deleteCohort(cohort.id)
            navigate({ to: '/classes', replace: true })
          }}
          confirmLabel="Excluir turma"
          description={`“${cohort.name}” será excluída.`}
          destructive
          notice={{ tone: 'irreversible' }}
          successMessage="Turma excluída."
          title="Excluir turma?"
          trigger={
            <Button className="w-fit" size="sm" variant="destructive-outline">
              <Trash2 /> Excluir turma
            </Button>
          }
        />
      </div>
    </Panel>
  )
}
