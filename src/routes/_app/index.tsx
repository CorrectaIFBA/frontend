import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { PROFILE_LABEL } from '@/components/shell/nav-items'
import { PageContent, PageTitle, Panel, PanelHeading } from '@/components/shell/page'
import { shellDialogs } from '@/components/shell/shell-dialogs'
import type { SelfAccountInfo } from '@/lib/api/identity'
import { meQueryOptions } from '@/lib/auth/session'

export const Route = createFileRoute('/_app/')({
  head: () => ({ meta: [{ title: 'Visão geral · Correcta' }] }),
  component: Overview,
})

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function greeting(hour: number) {
  if (hour < 5) return 'Boa noite'
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

/* The order a new institution actually has to do things in. */
const SETUP_STEPS = [
  {
    title: 'Cadastre servidores e docentes',
    description: 'Cada pessoa recebe um e-mail para ativar a conta e criar a senha.',
    to: '/faculty',
  },
  {
    title: 'Organize disciplinas e turmas',
    description: 'Vincule docentes às turmas de cada período letivo.',
    to: '/classes',
  },
  {
    title: 'Matricule os estudantes',
    description: 'Estudantes entram nas turmas e passam a ver as listas publicadas.',
    to: '/students',
  },
  {
    title: 'Monte o banco de problemas',
    description: 'Enunciados com casos de teste, prontos para correção automática.',
    to: '/problems',
  },
]

function Overview() {
  const { accountId } = Route.useRouteContext()
  const { data: me } = useSuspenseQuery(meQueryOptions(accountId))
  const now = new Date()

  return (
    <PageContent>
      <PageTitle
        description={
          me.profile.type === 'STAFF'
            ? 'Daqui você prepara a instituição para usar o Correcta: pessoas, turmas e avaliações.'
            : `O painel para ${PROFILE_LABEL[me.profile.type].toLowerCase()}s está chegando. Por enquanto, confira os dados da sua conta.`
        }
        eyebrow={dateFormat.format(now)}
        title={`${greeting(now.getHours())}, ${me.person.firstName}`}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {me.profile.type === 'STAFF' ? <SetupSteps /> : null}
        <AccountPanel me={me} />
      </div>
    </PageContent>
  )
}

function SetupSteps() {
  return (
    <Panel>
      <PanelHeading
        action={<span className="font-mono text-[11px] text-muted-foreground">4 etapas</span>}
        title="Primeiros passos"
      />
      <ol className="divide-y divide-border">
        {SETUP_STEPS.map((step, index) => (
          <motion.li
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 6 }}
            key={step.to}
            transition={{ delay: 0.04 * index, duration: 0.25, ease: [0.2, 0, 0, 1] }}
          >
            <Link
              className="group flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-accent/50"
              to={step.to}
            >
              <span className="pt-0.5 font-mono text-muted-foreground text-xs tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-[13px]">{step.title}</span>
                <span className="text-muted-foreground text-xs">{step.description}</span>
              </span>
              <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </Link>
          </motion.li>
        ))}
      </ol>
    </Panel>
  )
}

function AccountPanel({ me }: { me: SelfAccountInfo }) {
  const facts = [
    { label: 'Nome', value: me.person.displayName },
    { label: 'Login', value: <span className="font-mono">{me.account.login}</span> },
    { label: 'E-mail', value: me.account.email },
    { label: 'Perfil', value: PROFILE_LABEL[me.profile.type] },
    { label: 'CPF', value: <span className="font-mono">{me.person.documentNumber}</span> },
    { label: 'Sessão até', value: dateTimeFormat.format(new Date(me.session.expiresAt)) },
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
