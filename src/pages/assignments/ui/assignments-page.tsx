import { useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Attempts } from '@/pages/assignments/ui/attempts'
import { meQueryOptions } from '@/shared/api/session'
import { PageContent } from '@/shared/ui/page-content'
import { PageTitle } from '@/shared/ui/page-title'
import { PlaceholderPage } from '@/widgets/placeholder'

/*
  The student's attempts in every cohort: running ones first, with the time
  left and the way back in, then the finished ones. Activities not started
  yet live in each cohort's list, where the student starts them.
*/
export function AssignmentsPage() {
  const { accountId } = useRouteContext({ from: '/_app' })
  const { data: me } = useQuery(meQueryOptions(accountId))

  if (me && me.profile.type !== 'STUDENT') return <PlaceholderPage url="/assignments" />

  return (
    <PageContent>
      <PageTitle description="Suas tentativas em todas as turmas." title="Minhas atividades" />
      <Attempts />
    </PageContent>
  )
}
