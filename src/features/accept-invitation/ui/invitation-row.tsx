import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Check, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { COHORT_ROLE_LABEL, CohortTile } from '@/entities/cohort'
import { acceptInvitation, cohortAddress, type MyCohortInvitation } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import { Button } from '@/shared/ui/button'

export function InvitationRow({ invitation }: { invitation: MyCohortInvitation }) {
  const navigate = useNavigate()
  const { cohort } = invitation
  const accept = useMutation({
    mutationFn: () => acceptInvitation(cohort.id),
    onSuccess: () => {
      toast.success(`Você entrou em ${cohort.name}.`)
      navigate({ to: '/classes/$cohortRef', params: { cohortRef: cohortAddress(cohort) } })
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  return (
    <li className="flex items-center gap-3.5 rounded-lg border border-warning/30 bg-warning/6 p-3.5">
      <CohortTile className="size-11 text-[15px]" cohort={cohort} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium text-[13px]">{cohort.name}</span>
        <span className="text-muted-foreground text-xs leading-relaxed">
          Convite para ser {COHORT_ROLE_LABEL[invitation.role].toLowerCase()}
          {invitation.invitedByName ? `, enviado por ${invitation.invitedByName}` : ''}{' '}
          <time dateTime={invitation.invitedAt}>{relativeDate(invitation.invitedAt)}</time>
        </span>
        {invitation.expiresAt ? (
          <span className="text-muted-foreground text-xs">
            Vale até {dateTimeFormat.format(new Date(invitation.expiresAt))}
          </span>
        ) : null}
      </div>
      <Button disabled={accept.isPending} onClick={() => accept.mutate()} size="sm">
        {accept.isPending ? <LoaderCircle className="animate-spin" /> : <Check />}
        Aceitar
      </Button>
    </li>
  )
}
