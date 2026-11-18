import { useQuery } from '@tanstack/react-query'
import { IdentityCell } from '@/entities/profile'
import { type InstitutionalProfile, personQueryOptions } from '@/shared/api/directory'
import { IdentitySkeleton } from '@/shared/ui/identity-skeleton'

/*
  Profiles carry only the owner's id, so each row asks for the person. The
  answers are cached and shared with the person pages; once the profile list
  embeds the owner's name this becomes a plain field.
*/
export function ProfileIdentity({ profile }: { profile: InstitutionalProfile }) {
  const { data: person, isPending } = useQuery({
    ...personQueryOptions(profile.personId),
    staleTime: 5 * 60_000,
  })

  if (isPending) return <IdentitySkeleton />

  return (
    <IdentityCell
      name={person?.displayName ?? '—'}
      secondary={<span className="font-mono">{profile.credentials.login}</span>}
      type={profile.type}
    />
  )
}
