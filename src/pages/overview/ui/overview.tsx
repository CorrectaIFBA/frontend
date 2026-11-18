import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from '@tanstack/react-query'
import { dateFormat, greeting } from '@/pages/overview/lib/greeting'
import { AccountPanel } from '@/pages/overview/ui/account-panel'
import { SetupSteps } from '@/pages/overview/ui/setup-steps'
import { meQueryOptions } from '@/shared/api/session'
import { PageContent } from '@/shared/ui/page-content'
import { PageTitle } from '@/shared/ui/page-title'

const route = getRouteApi('/_app/')

export function Overview() {
  const { accountId } = route.useRouteContext()
  const { data: me } = useSuspenseQuery(meQueryOptions(accountId))
  const now = new Date()

  return (
    <PageContent>
      <PageTitle
        description="Cadastre pessoas e acompanhe turmas e avaliações."
        eyebrow={dateFormat.format(now)}
        title={`${greeting(now.getHours())}, ${me.person.firstName}`}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <SetupSteps />
        <AccountPanel me={me} />
      </div>
    </PageContent>
  )
}
