import { Pencil, Power, RotateCcw } from 'lucide-react'
import { PersonStatus } from '@/entities/person'
import { DetailAvatar } from '@/entities/profile'
import { EditPersonDialog } from '@/features/edit-person'
import { ProfilesPanel } from '@/pages/person/ui/profiles-panel'
import { deactivatePerson, type DetailedPerson, reactivatePerson } from '@/shared/api/directory'
import { formatCpf } from '@/shared/lib/cpf'
import { dateFormat, relativeDate } from '@/shared/lib/date-format'
import { BackLink } from '@/shared/ui/back-link'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { FactList } from '@/shared/ui/fact-list'
import { PageContent } from '@/shared/ui/page-content'
import { PageTitle } from '@/shared/ui/page-title'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

export function PersonDetail({ person }: { person: DetailedPerson }) {
  return (
    <PageContent>
      <BackLink label="Pessoas" to="/persons" />

      <PageTitle
        actions={
          <>
            <EditPersonDialog
              person={person}
              trigger={
                <Button variant="outline">
                  <Pencil /> Editar
                </Button>
              }
            />
            {person.active ? (
              <ConfirmDialog
                action={() => deactivatePerson(person.id)}
                confirmLabel="Desativar pessoa"
                description="Os perfis ativos e pendentes serão desativados e suas sessões encerradas. Nenhum perfil novo pode ser criado enquanto a pessoa estiver inativa."
                destructive
                notice={{ tone: 'attention', message: 'Reativar a pessoa não reativa os perfis. Eles precisam ser reativados um a um.' }}
                successMessage={`${person.displayName} foi desativada.`}
                title="Desativar pessoa?"
                trigger={
                  <Button variant="destructive-outline">
                    <Power /> Desativar
                  </Button>
                }
              />
            ) : (
              <ConfirmDialog
                action={() => reactivatePerson(person.id)}
                confirmLabel="Reativar pessoa"
                description="A pessoa volta a poder receber perfis. Perfis desativados precisam ser reativados um a um."
                successMessage={`${person.displayName} foi reativada.`}
                title="Reativar pessoa?"
                trigger={
                  <Button variant="outline">
                    <RotateCcw /> Reativar
                  </Button>
                }
              />
            )}
          </>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs">{formatCpf(person.documentNumber)}</span>
            <PersonStatus active={person.active} />
          </span>
        }
        leading={<DetailAvatar name={person.displayName} />}
        title={person.displayName}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Panel>
          <PanelHeading title="Dados pessoais" />
          <FactList
            facts={[
              { label: 'Nome civil', value: person.legalName },
              {
                label: 'Nome social',
                value: person.socialName ?? <span className="text-muted-foreground">Não informado</span>,
              },
              { label: 'CPF', value: <span className="font-mono">{formatCpf(person.documentNumber)}</span> },
              { label: 'Situação', value: <PersonStatus active={person.active} /> },
              {
                label: 'Cadastro',
                value: (
                  <>
                    {dateFormat.format(new Date(person.createdAt))}{' '}
                    <span className="text-muted-foreground">({relativeDate(person.createdAt)})</span>
                  </>
                ),
              },
            ]}
          />
        </Panel>

        <ProfilesPanel person={person} />
      </div>
    </PageContent>
  )
}
