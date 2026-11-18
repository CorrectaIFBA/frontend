import type { AccountSession } from '@/shared/api/identity'
import { revokeSession } from '@/shared/api/session'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { describeLastSeen, describeSession } from '@/widgets/app-shell/lib/describe-session'

export function SessionRow({
  accountId,
  session,
  current,
}: {
  accountId: string
  session: AccountSession
  current?: boolean
}) {
  const { label, place, icon: Icon } = describeSession(session)

  return (
    <div className="flex items-center gap-3 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
        <Icon className="size-4.5" />
      </span>
      <span className="grid min-w-0 flex-1 gap-1 leading-tight">
        <span className="font-medium text-[13px]">{label}</span>
        <span className="truncate text-muted-foreground text-xs">
          {place} · {current ? 'Este dispositivo' : describeLastSeen(session.lastSeenAt)}
        </span>
      </span>
      {current ? null : (
        <ConfirmDialog
          action={() => revokeSession(accountId, session.sessionId)}
          confirmLabel="Encerrar sessão"
          description={`${label} · ${place}`}
          destructive
          notice={{ tone: 'attention', message: 'O dispositivo sai da conta e precisa entrar de novo com a senha.' }}
          successMessage="Sessão encerrada."
          title="Encerrar esta sessão?"
          trigger={
            <Button size="sm" variant="outline">
              Encerrar
            </Button>
          }
        />
      )}
    </div>
  )
}
