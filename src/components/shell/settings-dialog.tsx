import { motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  Laptop,
  LogOut,
  type LucideIcon,
  Monitor,
  MonitorSmartphone,
  Moon,
  Palette,
  Search,
  Smartphone,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { AccountAvatar } from '@/components/shell/account-avatar'
import { PROFILE_LABEL } from '@/components/shell/nav-items'
import { type SettingsTab, shellDialogs } from '@/components/shell/shell-dialogs'
import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import type { SelfAccountInfo } from '@/lib/api/identity'
import { signOut } from '@/lib/auth/session'
import { cn } from '@/lib/utils'

type Section = { id: string; title: string }

type TabDefinition = {
  id: SettingsTab
  title: string
  icon: LucideIcon
  keywords: string[]
  /** Headings inside the tab, listed under it in the sidebar while it is open. */
  sections?: Section[]
}

const TAB_GROUPS: { label: string; tabs: TabDefinition[] }[] = [
  {
    label: 'Usuário',
    tabs: [
      {
        id: 'account',
        title: 'Minha conta',
        icon: UserRound,
        keywords: ['nome', 'login', 'e-mail', 'cpf', 'senha', 'segurança', 'status'],
        sections: [
          { id: 'account-info', title: 'Informações da conta' },
          { id: 'account-security', title: 'Senha e segurança' },
          { id: 'account-status', title: 'Status da conta' },
        ],
      },
      {
        id: 'sessions',
        title: 'Sessões',
        icon: MonitorSmartphone,
        keywords: ['dispositivos', 'encerrar', 'navegador'],
      },
    ],
  },
  {
    label: 'Preferências',
    tabs: [
      {
        id: 'appearance',
        title: 'Aparência',
        icon: Palette,
        keywords: ['tema', 'claro', 'escuro', 'idioma'],
      },
      {
        id: 'notifications',
        title: 'Notificações',
        icon: Bell,
        keywords: ['e-mail', 'avisos', 'resumo'],
      },
    ],
  },
]

const ALL_TABS = TAB_GROUPS.flatMap((group) => group.tabs)

function unavailable() {
  toast('Disponível em breve.')
}

/**
 * Account and preferences in one place, laid out like a desktop app's
 * settings: tabs on the left, the open tab's headings nested beneath it.
 */
export function SettingsDialog({ me, tab: initialTab }: { me: SelfAccountInfo; tab: SettingsTab }) {
  const [tab, setTab] = useState<SettingsTab>(initialTab)
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const current = ALL_TABS.find((definition) => definition.id === tab) ?? ALL_TABS[0]

  const term = query.trim().toLowerCase()
  const groups = TAB_GROUPS.map((group) => ({
    ...group,
    tabs: group.tabs.filter(
      (definition) =>
        !term ||
        [definition.title, ...definition.keywords, ...(definition.sections ?? []).map((s) => s.title)]
          .join(' ')
          .toLowerCase()
          .includes(term)
    ),
  })).filter((group) => group.tabs.length > 0)

  function selectTab(next: SettingsTab) {
    setTab(next)
    scrollRef.current?.scrollTo({ top: 0 })
  }

  // Lights up the heading being read, as the content scrolls.
  useEffect(() => {
    const root = scrollRef.current
    const sections = current.sections
    if (!(root && sections)) {
      setActiveSection(null)
      return
    }

    setActiveSection(sections[0].id)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { root, rootMargin: '0px 0px -70% 0px' }
    )

    for (const section of sections) {
      const element = root.querySelector(`#${section.id}`)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [current])

  function goToSection(id: string) {
    setActiveSection(id)
    scrollRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex h-full min-h-0">
      <nav className="hidden w-64 shrink-0 flex-col border-border border-r bg-sidebar md:flex">
        <div className="flex items-center gap-3 px-4 pt-5 pb-4">
          <AccountAvatar className="size-10 rounded-lg" name={me.person.displayName} />
          <div className="grid min-w-0 leading-tight">
            <span className="truncate font-semibold text-[14px]">{me.person.displayName}</span>
            <button
              className="mt-0.5 w-fit cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground"
              onClick={() => selectTab('account')}
              type="button"
            >
              {PROFILE_LABEL[me.profile.type]} · ver conta
            </button>
          </div>
        </div>

        <div className="px-3 pb-3">
          <label className="flex h-8 items-center gap-2 rounded-md border border-input bg-background/60 px-2.5 text-muted-foreground focus-within:border-ring">
            <Search className="size-3.5 shrink-0" />
            <input
              className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar"
              value={query}
            />
          </label>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-3">
          {groups.map((group) => (
            <div className="flex flex-col gap-px" key={group.label}>
              <span className="label-xs px-2.5 pt-1 pb-2 text-muted-foreground">{group.label}</span>
              {group.tabs.map((definition) => {
                const selected = definition.id === tab
                return (
                  <div key={definition.id}>
                    <button
                      aria-current={selected ? 'page' : undefined}
                      className={cn(
                        'flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-left text-[13px] transition-colors',
                        selected
                          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                      )}
                      onClick={() => selectTab(definition.id)}
                      type="button"
                    >
                      <definition.icon
                        className={cn('size-4', selected ? 'text-sidebar-primary' : 'opacity-60')}
                      />
                      {definition.title}
                    </button>

                    {selected && definition.sections ? (
                      <div className="mt-1 mb-1 ml-[1.15rem] flex flex-col border-sidebar-border border-l">
                        {definition.sections.map((section) => (
                          <button
                            className={cn(
                              '-ml-px cursor-pointer border-l py-1.5 pl-3.5 text-left text-xs transition-colors',
                              activeSection === section.id
                                ? 'border-sidebar-primary text-sidebar-foreground'
                                : 'border-transparent text-sidebar-foreground/55 hover:text-sidebar-foreground'
                            )}
                            key={section.id}
                            onClick={() => goToSection(section.id)}
                            type="button"
                          >
                            {section.title}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ))}
          {groups.length === 0 ? (
            <p className="px-2.5 py-4 text-muted-foreground text-xs">Nada encontrado para “{query}”.</p>
          ) : null}
        </div>

        <div className="border-border border-t p-3">
          <button
            className="flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-[13px] text-destructive transition-colors hover:bg-destructive/10"
            onClick={async () => {
              shellDialogs.close()
              await signOut(me.profile.profileId)
            }}
            type="button"
          >
            <LogOut className="size-4" />
            Sair desta conta
          </button>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-border border-b px-5">
          <DialogTitle className="font-semibold text-[14px]">{current.title}</DialogTitle>
          <DialogDescription className="sr-only">Configurações da sua conta</DialogDescription>
          <button
            aria-label="Fechar configurações"
            className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => shellDialogs.close()}
            type="button"
          >
            <span className="hidden font-mono text-[10px] sm:inline">ESC</span>
            <X className="size-4" />
          </button>
        </header>

        {/* Below md the sidebar folds into a row of tabs. */}
        <div className="flex gap-1 overflow-x-auto border-border border-b px-3 py-2 md:hidden">
          {ALL_TABS.map((definition) => (
            <button
              className={cn(
                'flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs',
                definition.id === tab ? 'bg-accent text-foreground' : 'text-muted-foreground'
              )}
              key={definition.id}
              onClick={() => selectTab(definition.id)}
              type="button"
            >
              <definition.icon className="size-3.5" />
              {definition.title}
            </button>
          ))}
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          // The last heading may never reach the top; at the bottom it is the one being read.
          onScroll={(event) => {
            const element = event.currentTarget
            const sections = current.sections
            if (sections && element.scrollTop + element.clientHeight >= element.scrollHeight - 4) {
              setActiveSection(sections[sections.length - 1].id)
            }
          }}
          ref={scrollRef}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-[680px] px-6 py-8 sm:px-10 sm:py-10"
            initial={{ opacity: 0, y: 6 }}
            key={tab}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
          >
            {tab === 'account' ? (
              <AccountTab me={me} onOpenSessions={() => selectTab('sessions')} />
            ) : tab === 'sessions' ? (
              <SessionsTab />
            ) : tab === 'appearance' ? (
              <AppearanceTab />
            ) : (
              <NotificationsTab />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Building blocks
--------------------------------------------------------------------------- */

function SettingsSection({
  id,
  title,
  aside,
  children,
}: {
  id?: string
  title: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="scroll-mt-6 border-border border-b pb-8 not-first:pt-8 last:border-b-0" id={id}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-lg tracking-[-0.025em]">{title}</h2>
        {aside}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  )
}

function SettingRow({
  label,
  hint,
  value,
  action,
  onClick,
}: {
  label: string
  hint?: string
  value?: ReactNode
  action?: ReactNode
  /** Makes the whole row a link to somewhere else, with a chevron. */
  onClick?: () => void
}) {
  const body = (
    <>
      <span className="grid min-w-0 gap-0.5">
        <span className="font-medium text-[13px]">{label}</span>
        {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
      </span>
      <span className="ml-auto flex min-w-0 items-center gap-3">
        {value ? <span className="truncate text-right text-[13px]">{value}</span> : null}
        {action}
        {onClick ? <ChevronRight className="size-4 shrink-0 text-muted-foreground" /> : null}
      </span>
    </>
  )

  const className = 'flex min-h-14 items-center gap-4 rounded-md py-2'

  if (onClick) {
    return (
      <button
        className={cn(className, '-mx-3 cursor-pointer px-3 text-left transition-colors hover:bg-accent/60')}
        onClick={onClick}
        type="button"
      >
        {body}
      </button>
    )
  }

  return <div className={className}>{body}</div>
}

function EditButton({ children = 'Editar' }: { children?: ReactNode }) {
  return (
    <Button className="w-20 shrink-0" onClick={unavailable} size="sm" variant="outline">
      {children}
    </Button>
  )
}

function MockNotice() {
  return (
    <span className="label-xs rounded-sm bg-warning/15 px-1.5 py-1 text-warning">
      Dados de exemplo
    </span>
  )
}

/* ---------------------------------------------------------------------------
   Tabs
--------------------------------------------------------------------------- */

const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function maskEmail(email: string) {
  const [user, domain] = email.split('@')
  if (!domain) return email
  return `${'*'.repeat(Math.max(user.length, 3))}@${domain}`
}

const SESSIONS = [
  { id: 'lab', label: 'Firefox no Linux', icon: Monitor, place: 'Laboratório 3 · Salvador, BA', seen: 'Há 2 dias' },
  { id: 'phone', label: 'Chrome no Android', icon: Smartphone, place: 'Feira de Santana, BA', seen: 'Há 5 dias' },
]

function AccountTab({ me, onOpenSessions }: { me: SelfAccountInfo; onOpenSessions: () => void }) {
  const [showEmail, setShowEmail] = useState(false)
  const active = me.profile.state === 'ACTIVE'

  return (
    <>
      <SettingsSection id="account-info" title="Informações da conta">
        <SettingRow action={<EditButton />} label="Nome de exibição" value={me.person.displayName} />
        <SettingRow
          hint="Definido pela instituição; não pode ser alterado."
          label="Login"
          value={<span className="font-mono">{me.account.login}</span>}
        />
        <SettingRow
          action={<EditButton />}
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
        <SettingRow
          label="CPF"
          value={<span className="font-mono">{me.person.documentNumber}</span>}
        />
      </SettingsSection>

      <SettingsSection id="account-security" title="Senha e segurança">
        <SettingRow action={<EditButton>Alterar</EditButton>} label="Senha" />
        <SettingRow
          label="Dispositivos conectados"
          onClick={onOpenSessions}
          value={`${SESSIONS.length + 1} dispositivos`}
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
              Perfil de {PROFILE_LABEL[me.profile.type].toLowerCase()}. Esta sessão vale até{' '}
              {dateTimeFormat.format(new Date(me.session.expiresAt))}.
            </span>
          </div>
        </div>
      </SettingsSection>
    </>
  )
}

function describeThisDevice() {
  const agent = navigator.userAgent
  const browser = /Edg\//.test(agent)
    ? 'Edge'
    : /Firefox\//.test(agent)
      ? 'Firefox'
      : /Chrome\//.test(agent)
        ? 'Chrome'
        : /Safari\//.test(agent)
          ? 'Safari'
          : 'Navegador'
  const system = /Windows/.test(agent)
    ? 'Windows'
    : /Android/.test(agent)
      ? 'Android'
      : /iPhone|iPad/.test(agent)
        ? 'iOS'
        : /Mac OS X/.test(agent)
          ? 'macOS'
          : /Linux/.test(agent)
            ? 'Linux'
            : 'sistema desconhecido'

  return { label: `${browser} no ${system}`, mobile: /Android|iPhone|iPad/.test(agent) }
}

function SessionRow({
  icon: Icon,
  label,
  detail,
  current,
}: {
  icon: LucideIcon
  label: string
  detail: string
  current?: boolean
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
        <Icon className="size-4.5" />
      </span>
      <span className="grid min-w-0 flex-1 gap-1 leading-tight">
        <span className="font-medium text-[13px]">{label}</span>
        <span className="truncate text-muted-foreground text-xs">{detail}</span>
      </span>
      {current ? null : (
        <Button onClick={unavailable} size="sm" variant="outline">
          Encerrar
        </Button>
      )}
    </div>
  )
}

/* The current device is read from the browser; the others are examples. */
function SessionsTab() {
  const thisDevice = describeThisDevice()

  return (
    <>
      <SettingsSection aside={<MockNotice />} title="Este dispositivo">
        <SessionRow
          current
          detail="Salvador, BA · Ativo agora"
          icon={thisDevice.mobile ? Smartphone : Laptop}
          label={thisDevice.label}
        />
      </SettingsSection>

      <SettingsSection
        aside={
          <Button onClick={unavailable} size="sm" variant="destructive-outline">
            Encerrar todas
          </Button>
        }
        title="Outros dispositivos"
      >
        <p className="-mt-2 mb-2 text-muted-foreground text-xs">
          Encerre qualquer sessão que você não reconheça e altere sua senha em seguida.
        </p>
        <div className="divide-y divide-border">
          {SESSIONS.map((session) => (
            <SessionRow
              detail={`${session.place} · ${session.seen}`}
              icon={session.icon}
              key={session.id}
              label={session.label}
            />
          ))}
        </div>
      </SettingsSection>
    </>
  )
}

const THEMES = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
] as const

function AppearanceTab() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <SettingsSection title="Tema">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((option) => (
            <button
              aria-pressed={theme === option.value}
              className={cn(
                'group flex cursor-pointer flex-col gap-2.5 rounded-lg border p-2.5 text-left transition-colors',
                theme === option.value
                  ? 'border-primary bg-primary/6'
                  : 'border-border hover:border-border-strong'
              )}
              key={option.value}
              onClick={() => setTheme(option.value)}
              type="button"
            >
              <ThemePreview variant={option.value} />
              <span className="flex items-center gap-1.5 px-0.5 text-[13px]">
                <option.icon className="size-3.5 text-muted-foreground" />
                {option.label}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-muted-foreground text-xs">Salvo neste navegador.</p>
      </SettingsSection>

      <SettingsSection title="Idioma">
        <SettingRow hint="Outros idiomas chegam depois." label="Português (Brasil)" value="Padrão" />
      </SettingsSection>
    </>
  )
}

/* A miniature of the shell in each theme, so the choice is seen, not read. */
function ThemePreview({ variant }: { variant: 'light' | 'dark' | 'system' }) {
  const pane = (dark: boolean) => (
    <div className={cn('flex h-full flex-1 gap-1 p-1.5', dark ? 'bg-[#141a1a]' : 'bg-[#f6f8f8]')}>
      <div className={cn('w-1/4 rounded-[3px]', dark ? 'bg-white/8' : 'bg-black/6')} />
      <div className="flex flex-1 flex-col gap-1">
        <div className={cn('h-1.5 w-2/3 rounded-full', dark ? 'bg-white/20' : 'bg-black/15')} />
        <div className={cn('h-1.5 w-1/2 rounded-full', dark ? 'bg-white/10' : 'bg-black/8')} />
        <div className="mt-auto h-2 w-1/3 rounded-[2px] bg-primary/80" />
      </div>
    </div>
  )

  return (
    <div className="flex h-16 overflow-hidden rounded-md border border-border">
      {variant === 'system' ? (
        <>
          {pane(false)}
          {pane(true)}
        </>
      ) : (
        pane(variant === 'dark')
      )}
    </div>
  )
}

function NotificationsTab() {
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
