import { useQuery } from '@tanstack/react-query'
import { Navigate } from '@tanstack/react-router'
import { PROFILE_KINDS, type ProfileKind } from '@/entities/profile'
import { ProfileDetail } from '@/pages/profile-detail/ui/profile-detail'
import { profileQueryOptions } from '@/shared/api/directory'
import { DetailError } from '@/shared/ui/detail-error'
import { DetailSkeleton } from '@/shared/ui/detail-skeleton'

export function ProfileDetailPage({ kind, profileId }: { kind: ProfileKind; profileId: string }) {
  const query = useQuery(profileQueryOptions(profileId))

  if (query.isPending) return <DetailSkeleton />
  if (query.isError) return <DetailError error={query.error} onRetry={() => query.refetch()} />

  const profile = query.data

  // A link built for the wrong list: send it to where this profile lives.
  if (profile.type !== kind.type) {
    return (
      <Navigate
        params={{ profileId }}
        replace
        to={`${PROFILE_KINDS[profile.type].url}/$profileId`}
      />
    )
  }

  return <ProfileDetail kind={kind} profile={profile} />
}
