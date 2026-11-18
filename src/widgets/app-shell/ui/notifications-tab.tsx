import { useState } from 'react'
import { Switch } from '@/shared/ui/switch'
import { MockNotice } from '@/widgets/app-shell/ui/mock-notice'
import { SettingsSection } from '@/widgets/app-shell/ui/settings-section'

export function NotificationsTab() {
  const [settings, setSettings] = useState({
    activations: true,
    submissions: false,
    weekly: true,
  })

  const toggles = [
    {
      key: 'activations' as const,
      title: 'Contas ativadas',
      description: 'Quando alguém que você cadastrou criar a senha.',
    },
    {
      key: 'submissions' as const,
      title: 'Picos de submissões',
      description: 'Quando uma lista receber muitos envios em pouco tempo.',
    },
    {
      key: 'weekly' as const,
      title: 'Resumo semanal',
      description: 'Um e-mail às segundas com o andamento das turmas.',
    },
  ]

  return (
    <SettingsSection aside={<MockNotice />} title="E-mails">
      {toggles.map((toggle) => (
        <label
          className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-2"
          htmlFor={`notify-${toggle.key}`}
          key={toggle.key}
        >
          <span className="grid gap-0.5">
            <span className="font-medium text-[13px]">{toggle.title}</span>
            <span className="text-muted-foreground text-xs">{toggle.description}</span>
          </span>
          <Switch
            checked={settings[toggle.key]}
            id={`notify-${toggle.key}`}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, [toggle.key]: checked }))
            }
          />
        </label>
      ))}
      <p className="mt-2 text-muted-foreground text-xs">
        Ainda não são salvas no servidor.
      </p>
    </SettingsSection>
  )
}
