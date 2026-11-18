import { useQuery } from '@tanstack/react-query'
import { errorMessage } from '@/shared/api/errors'
import { currentSessionId, revokeAllSessions, sessionsQueryOptions } from '@/shared/api/session'
import { shellDialogs } from '@/shared/lib/shell-dialogs'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Skeleton } from '@/shared/ui/skeleton'
import { SessionRow } from '@/widgets/app-shell/ui/session-row'
import { SettingsSection } from '@/widgets/app-shell/ui/settings-section'

export function SessionsTab({ accountId }: { accountId: string }) {
  const sessionsQuery = useQuery(sessionsQueryOptions(accountId))

  const currentId = currentSessionId(accountId)
  const sessions = sessionsQuery.data ?? []
  const current = sessions.find((session) => session.sessionId === currentId)
  const others = sessions.filter((session) => session !== current)

  if (sessionsQuery.isPending) {
    return (
      <SettingsSection title="Sessões ativas">
        {[0, 1].map((index) => (
          <div className="flex items-center gap-3 py-3" key={index}>
            <Skeleton className="size-10 rounded-lg" />
            <span className="grid flex-1 gap-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-56" />
            </span>
          </div>
        ))}
      </SettingsSection>
    )
  }

  if (sessionsQuery.isError) {
    return (
      <SettingsSection title="Sessões ativas">
        <p className="text-muted-foreground text-xs">{errorMessage(sessionsQuery.error)}</p>
        <Button className="mt-3 w-fit" onClick={() => sessionsQuery.refetch()} size="sm" variant="outline">
          Tentar novamente
        </Button>
      </SettingsSection>
    )
  }

  return (
    <>
      {current ? (
        <SettingsSection title="Este dispositivo">
          <SessionRow accountId={accountId} current session={current} />
        </SettingsSection>
      ) : null}

      <SettingsSection
        aside={
          <ConfirmDialog
            action={async () => {
              await revokeAllSessions(accountId)
              shellDialogs.close()
            }}
            confirmLabel="Encerrar todas e sair"
            description="Todos os dispositivos saem da conta e precisam entrar de novo com a senha."
            destructive
            notice={{ tone: 'attention', message: 'Inclui esta sessão: você sai da conta agora.' }}
            successMessage="Todas as sessões foram encerradas."
            title="Encerrar todas as sessões?"
            trigger={
              <Button size="sm" variant="destructive-outline">
                Encerrar todas
              </Button>
            }
          />
        }
        title="Outros dispositivos"
      >
        <p className="-mt-2 mb-2 text-muted-foreground text-xs">
          Encerre sessões que você não reconhece e troque sua senha. Encerrar todas inclui esta.
        </p>
        {others.length > 0 ? (
          <div className="divide-y divide-border">
            {others.map((session) => (
              <SessionRow accountId={accountId} key={session.sessionId} session={session} />
            ))}
          </div>
        ) : (
          <p className="py-3 text-muted-foreground text-xs">Nenhuma outra sessão ativa.</p>
        )}
      </SettingsSection>
    </>
  )
}
