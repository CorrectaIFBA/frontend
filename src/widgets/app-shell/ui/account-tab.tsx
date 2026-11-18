import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { PROFILE_LABEL } from '@/entities/profile'
import type { SelfAccountInfo } from '@/shared/api/identity'
import { sessionsQueryOptions } from '@/shared/api/session'
import { cn } from '@/shared/lib/cn'
import { maskEmail } from '@/widgets/app-shell/lib/mask-email'
import { EditButton } from '@/widgets/app-shell/ui/edit-button'
import { SettingRow } from '@/widgets/app-shell/ui/setting-row'
import { SettingsSection } from '@/widgets/app-shell/ui/settings-section'

export function AccountTab({ me, onOpenSessions }: { me: SelfAccountInfo; onOpenSessions: () => void }) {
  const [showEmail, setShowEmail] = useState(false)
  const { data: sessions } = useQuery(sessionsQueryOptions(me.profile.profileId))
  const active = me.profile.state === 'ACTIVE'

  return (
    <>
      <SettingsSection id="account-info" title="Informações da conta">
        <SettingRow label="Nome de exibição" value={me.person.displayName} />
        <SettingRow
          hint="Definido pela instituição; não pode ser alterado."
          label="Login"
          value={<span className="font-mono">{me.account.login}</span>}
        />
        <SettingRow
          label="E-mail"
          value={
            <>
              {showEmail ? me.account.email : maskEmail(me.account.email)}{' '}
              <button
                className="cursor-pointer text-primary hover:underline"
                onClick={() => setShowEmail((value) => !value)}
                type="button"
              >
                {showEmail ? 'Ocultar' : 'Mostrar'}
              </button>
            </>
          }
        />
      </SettingsSection>

      <SettingsSection id="account-security" title="Senha e segurança">
        <SettingRow action={<EditButton>Alterar</EditButton>} label="Senha" />
        <SettingRow
          label="Dispositivos conectados"
          onClick={onOpenSessions}
          value={
            sessions
              ? `${sessions.length} ${sessions.length === 1 ? 'dispositivo' : 'dispositivos'}`
              : undefined
          }
        />
      </SettingsSection>

      <SettingsSection id="account-status" title="Status da conta">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <span
            className={cn(
              'mt-1 size-2 shrink-0 rounded-full',
              active ? 'bg-success' : 'bg-warning'
            )}
          />
          <div className="grid gap-1">
            <span className="font-medium text-[13px]">
              {active ? 'Conta ativa' : 'Conta aguardando ativação'}
            </span>
            <span className="text-muted-foreground text-xs leading-relaxed">
              Perfil de {PROFILE_LABEL[me.profile.type].toLowerCase()}.
            </span>
          </div>
        </div>
      </SettingsSection>
    </>
  )
}
