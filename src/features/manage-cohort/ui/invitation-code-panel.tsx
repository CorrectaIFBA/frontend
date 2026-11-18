import { useQuery } from '@tanstack/react-query'
import { KeyRound, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { useCohortView } from '@/entities/cohort'
import { VALIDITY } from '@/features/manage-cohort/config/code-validity'
import { inDays } from '@/shared/lib/in-days'
import { CurrentCode } from '@/features/manage-cohort/ui/current-code'
import { generateInvitationCode, invitationCodeQueryOptions, revokeInvitationCode } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { PanelNote } from '@/shared/ui/panel-note'
import { Segmented } from '@/shared/ui/segmented'
import { Skeleton } from '@/shared/ui/skeleton'

export function InvitationCodePanel() {
  const { cohort } = useCohortView()
  const query = useQuery(invitationCodeQueryOptions(cohort.id))
  const [validity, setValidity] = useState<(typeof VALIDITY)[number]['value']>('7')

  // Thirty days is the service's default and its limit; leaving it out avoids clock skew.
  const generate = () =>
    generateInvitationCode(cohort.id, validity === '30' ? undefined : inDays(Number(validity)))

  const current = query.data
  let status: React.ReactNode
  if (query.isPending) {
    status = <Skeleton className="h-24 w-full" />
  } else if (query.isError) {
    status = <PanelNote>{errorMessage(query.error)}</PanelNote>
  } else if (current) {
    status = <CurrentCode code={current} />
  } else {
    status = <p className="text-muted-foreground text-xs">Nenhum código válido. Gere um para que as pessoas entrem sozinhas.</p>
  }

  return (
    <Panel>
      <PanelHeading
        action={
          current ? (
            <ConfirmDialog
              action={() => revokeInvitationCode(cohort.id)}
              confirmLabel="Revogar"
              description="Quem já entrou continua na turma."
              destructive
              notice={{ tone: 'irreversible', message: 'O código não volta a funcionar. Para aceitar novas entradas, gere outro.' }}
              successMessage="Código revogado."
              title="Revogar o código atual?"
              trigger={
                <Button size="xs" variant="ghost-muted">
                  <X /> Revogar
                </Button>
              }
            />
          ) : null
        }
        title="Código de convite"
      />
      <div className="flex flex-col gap-4 p-4">
        {status}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">Válido por</span>
          <Segmented label="Validade do código" onChange={setValidity} options={[...VALIDITY]} value={validity} />
          {current ? (
            <ConfirmDialog
              action={generate}
              confirmLabel="Gerar novo código"
              description="Quem já entrou continua na turma."
              notice={{ tone: 'irreversible', message: 'O código atual deixa de funcionar e não pode ser recuperado.' }}
              successMessage="Novo código gerado."
              title="Gerar um novo código?"
              trigger={
                <Button className="ml-auto" size="sm" variant="outline">
                  <RotateCcw /> Gerar novo
                </Button>
              }
            />
          ) : (
            <ConfirmDialog
              action={generate}
              confirmLabel="Gerar código"
              description={`O código vale por ${VALIDITY.find((option) => option.value === validity)?.label}.`}
              notice={{ tone: 'attention', message: 'Quem tiver o código entra na turma sem convite enquanto ele valer.' }}
              successMessage="Código gerado."
              title="Gerar um código de convite?"
              trigger={
                <Button className="ml-auto" size="sm">
                  <KeyRound /> Gerar código
                </Button>
              }
            />
          )}
        </div>
      </div>
    </Panel>
  )
}
