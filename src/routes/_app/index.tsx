import { createFileRoute, redirect } from '@tanstack/react-router'
import { Overview } from '@/pages/overview'
import { meQueryOptions } from '@/shared/api/session'

export const Route = createFileRoute('/_app/')({
  // Faculty and students land on their cohorts; the overview is the staff's setup checklist.
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions(context.accountId))
    if (me.profile.type !== 'STAFF') throw redirect({ to: '/classes', replace: true })
  },
  head: () => ({ meta: [{ title: 'Visão geral · Correcta' }] }),
  component: Overview,
})
