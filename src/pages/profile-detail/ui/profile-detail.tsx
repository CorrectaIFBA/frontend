import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { LoaderCircle, Mail, Power, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import type { ProfileKind } from '@/entities/profile'
import { DetailAvatar, ProfileStateStatus, ProfileTypeTag } from '@/entities/profile'
import { EditEmailDialog } from '@/pages/profile-detail/ui/edit-email-dialog'
import { PersonCard } from '@/pages/profile-detail/ui/person-card'
import { ProfileCohortsPanel } from '@/pages/profile-detail/ui/profile-cohorts-panel'
import { StateNote } from '@/pages/profile-detail/ui/state-note'
import { deactivateProfile, type InstitutionalProfile, personQueryOptions, reactivateProfile, resendActivation } from '@/shared/api/directory'
import { errorMessage } from '@/shared/api/errors'
import { meQueryOptions } from '@/shared/api/session'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import { BackLink } from '@/shared/ui/back-link'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { FactList } from '@/shared/ui/fact-list'
import { PageContent } from '@/shared/ui/page-content'
import { PageTitle } from '@/shared/ui/page-title'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { Skeleton } from '@/shared/ui/skeleton'

export function ProfileDetail({ kind, profile }: { kind: ProfileKind; profile: InstitutionalProfile }) {
  const { accountId } = useRouteContext({ from: '/_app' })
  const { data: me } = useQuery(meQueryOptions(accountId))
  const { data: person } = useQuery(personQueryOptions(profile.personId))
  const isSelf = me?.profile.profileId === profile.id

  const resend = useMutation({
    mutationFn: () => resendActivation(profile.id),
    onSuccess: () => toast.success(`Novo link de ativação enviado para ${profile.email}.`),
    onError: (error) => toast.error(errorMessage(error)),
  })

  return (
    <PageContent>
      <BackLink label={kind.title} to={kind.url} />

      <PageTitle
        actions={
          <>
            {profile.state === 'PENDING' ? (
              <Button disabled={resend.isPending} onClick={() => resend.mutate()} variant="outline">
                {resend.isPending ? <LoaderCircle className="animate-spin" /> : <Mail />}
                Reenviar ativação
              </Button>
            ) : null}
            {profile.state === 'INACTIVE' ? (
              <ConfirmDialog
                action={() => reactivateProfile(profile.id)}
                confirmLabel="Reativar"
                description="O acesso volta a ser permitido. Se a senha ainda não foi criada, o perfil fica pendente de ativação."
                successMessage="Perfil reativado."
                title="Reativar perfil?"
                trigger={
                  <Button variant="outline">
                    <RotateCcw /> Reativar
                  </Button>
                }
              />
            ) : isSelf ? null : (
              <ConfirmDialog
                action={() => deactivateProfile(profile.id)}
                confirmLabel="Desativar"
                description="As sessões serão encerradas e o login bloqueado até a reativação."
                destructive
                notice={{ tone: 'irreversible', message: 'Links de ativação pendentes deixam de valer. Será preciso enviar um novo.' }}
                successMessage="Perfil desativado."
                title="Desativar perfil?"
                trigger={
                  <Button variant="destructive-outline">
                    <Power /> Desativar
                  </Button>
                }
              />
            )}
          </>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            <ProfileTypeTag label={kind.singular} type={kind.type} />
            <ProfileStateStatus state={profile.state} />
            <span className="font-mono text-xs">{profile.credentials.login}</span>
            {isSelf ? <span className="text-xs">· este é o seu perfil</span> : null}
          </span>
        }
        leading={
          person ? (
            <DetailAvatar name={person.displayName} type={kind.type} />
          ) : (
            <Skeleton className="size-14 rounded-xl" />
          )
        }
        title={person ? person.displayName : <Skeleton className="h-6 w-56" />}
      />

      {profile.state === 'PENDING' ? (
        <StateNote tone="warning">
          Conta não ativada. Link enviado para{' '}
          <span className="font-medium text-foreground">{profile.email}</span>.
        </StateNote>
      ) : profile.state === 'INACTIVE' ? (
        <StateNote tone="muted">
          Perfil desativado. O login não funciona até que ele seja reativado.
        </StateNote>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeading action={<EditEmailDialog profile={profile} />} title="Conta de acesso" />
            <FactList
              facts={[
                { label: 'Login', value: <span className="font-mono">{profile.credentials.login}</span> },
                { label: 'E-mail', value: profile.email },
                { label: 'Situação', value: <ProfileStateStatus state={profile.state} /> },
                {
                  label: 'Criado',
                  value: (
                    <>
                      {dateTimeFormat.format(new Date(profile.createdAt))}{' '}
                      <span className="text-muted-foreground">({relativeDate(profile.createdAt)})</span>
                    </>
                  ),
                },
              ]}
            />
          </Panel>

          {kind.type === 'STAFF' ? null : <ProfileCohortsPanel profileId={profile.id} />}
        </div>

        <PersonCard person={person} profileId={profile.id} />
      </div>
    </PageContent>
  )
}
