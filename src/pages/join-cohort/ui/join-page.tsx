import { useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { LoaderCircle, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { PROFILE_LABEL } from '@/entities/profile'
import { useJoinCohort } from '@/features/join-cohort'
import type { CohortMembership } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { meQueryOptions } from '@/shared/api/session'
import { BackLink } from '@/shared/ui/back-link'
import { Button } from '@/shared/ui/button'
import { FormAlert } from '@/shared/ui/form-alert'
import { PageContent } from '@/shared/ui/page-content'
import { Panel } from '@/shared/ui/panel'

/**
 * Where a shared link lands: a code or an invitation to accept. Nothing
 * happens until the person confirms, so opening a link never joins by itself.
 */
export function JoinPage({
  icon: Icon,
  title,
  description,
  confirmLabel,
  join,
}: {
  icon: LucideIcon
  title: string
  description: ReactNode
  confirmLabel: string
  join: () => Promise<CohortMembership>
}) {
  const { accountId } = useRouteContext({ from: '/_app' })
  const { data: me } = useQuery(meQueryOptions(accountId))
  const mutation = useJoinCohort(join)
  const eligible = me && me.profile.type !== 'STAFF'

  return (
    <PageContent className="max-w-xl">
      <BackLink label="Turmas" to="/classes" />
      <Panel>
        <div className="flex flex-col items-start gap-4 p-6">
          <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-semibold text-[19px] tracking-[-0.025em]">{title}</h1>
            <div className="text-muted-foreground text-sm leading-relaxed">{description}</div>
          </div>
          {me ? (
            <p className="text-muted-foreground text-xs">
              Você vai entrar como{' '}
              <span className="font-medium text-foreground">
                {me.person.displayName} ({PROFILE_LABEL[me.profile.type].toLowerCase()})
              </span>
              .
            </p>
          ) : null}
          <div className="w-full">
            <FormAlert
              message={
                me && !eligible
                  ? 'Perfis de servidor não participam de turmas. Troque para um perfil de estudante ou docente.'
                  : mutation.isError
                    ? errorMessage(mutation.error)
                    : null
              }
            />
          </div>
          <Button disabled={!eligible || mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </Panel>
    </PageContent>
  )
}
