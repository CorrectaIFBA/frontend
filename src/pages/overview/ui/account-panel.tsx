import { PROFILE_LABEL } from '@/entities/profile'
import type { SelfAccountInfo } from '@/shared/api/identity'
import { shellDialogs } from '@/shared/lib/shell-dialogs'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

export function AccountPanel({ me }: { me: SelfAccountInfo }) {
  const facts = [
    { label: 'Nome', value: me.person.displayName },
    { label: 'Login', value: <span className="font-mono">{me.account.login}</span> },
    { label: 'E-mail', value: me.account.email },
    { label: 'Perfil', value: PROFILE_LABEL[me.profile.type] },
  ]

  return (
    <Panel>
      <PanelHeading
        action={
          <button
            className="cursor-pointer text-primary text-xs underline-offset-4 hover:underline"
            onClick={() => shellDialogs.settings('sessions')}
            type="button"
          >
            Gerenciar sessões
          </button>
        }
        title="Sua conta"
      />
      <dl className="grid gap-x-4 gap-y-3.5 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        {facts.map((fact) => (
          <div className="contents" key={fact.label}>
            <dt className="label-xs pt-1 text-muted-foreground">{fact.label}</dt>
            <dd className="truncate text-[13px]">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="border-border border-t px-4 py-3 text-muted-foreground text-xs">
        Pressione <kbd className="rounded-sm border border-border px-1 font-mono text-[10px]">/</kbd>{' '}
        em qualquer tela para buscar.
      </p>
    </Panel>
  )
}
