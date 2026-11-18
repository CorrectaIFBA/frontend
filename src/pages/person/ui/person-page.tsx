import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from '@tanstack/react-query'
import { PersonDetail } from '@/pages/person/ui/person-detail'
import { personQueryOptions } from '@/shared/api/directory'
import { DetailError } from '@/shared/ui/detail-error'
import { DetailSkeleton } from '@/shared/ui/detail-skeleton'

const route = getRouteApi('/_app/persons/$personId')

export function PersonPage() {
  const { personId } = route.useParams()
  const query = useQuery(personQueryOptions(personId))

  if (query.isPending) return <DetailSkeleton />
  if (query.isError) return <DetailError error={query.error} onRetry={() => query.refetch()} />

  return <PersonDetail person={query.data} />
}
