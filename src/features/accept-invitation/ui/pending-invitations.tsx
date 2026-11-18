import { useQuery } from '@tanstack/react-query'
import { InvitationRow } from '@/features/accept-invitation/ui/invitation-row'
import { myInvitationsQueryOptions } from '@/shared/api/cohorts'

/**
 * Invitations waiting for the signed-in profile. Shown above the cohort list
 * and only when there is something to answer.
 */
export function PendingInvitations() {
  const query = useQuery(myInvitationsQueryOptions())
  if (!query.data?.length) return null

  return (
    <section aria-labelledby="pending-invitations" className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h2 className="font-semibold text-[13px]" id="pending-invitations">
          Convites pendentes
        </h2>
        <span className="text-muted-foreground text-xs tabular-nums">{query.data.length}</span>
      </div>
      <ul className="grid gap-3 lg:grid-cols-2">
        {query.data.map((invitation) => (
          <InvitationRow invitation={invitation} key={invitation.id} />
        ))}
      </ul>
    </section>
  )
}
