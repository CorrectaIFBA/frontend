import { useQuery } from '@tanstack/react-query'
import { PROFILE_KINDS, ProfileTypeTag, PROFILE_ORDER } from '@/entities/profile'
import { personQueryOptions } from '@/shared/api/directory'
import { Skeleton } from '@/shared/ui/skeleton'

/*
  The list carries no profiles, so each row asks for its person. Answers are
  cached and reused when the person page opens.
*/
export function PersonProfiles({ personId }: { personId: string }) {
  const { data: person, isPending } = useQuery({ ...personQueryOptions(personId), staleTime: 5 * 60_000 })

  if (isPending) return <Skeleton className="h-5 w-20 rounded-sm" />
  if (!person) return null

  const types = PROFILE_ORDER.filter((type) =>
    person.institutionalProfiles.some((profile) => profile.type === type)
  )
  if (types.length === 0) return <span className="text-muted-foreground text-xs">Sem perfil</span>

  return (
    <span className="flex flex-wrap gap-1">
      {types.map((type) => (
        <ProfileTypeTag key={type} label={PROFILE_KINDS[type].singular} type={type} />
      ))}
    </span>
  )
}
