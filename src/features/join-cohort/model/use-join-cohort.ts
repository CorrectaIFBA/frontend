import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { cohortAddress, findCohort } from '@/shared/api/cohorts'

/** Joins, then opens the cohort; the answer names only its id. */
export function useJoinCohort(join: () => Promise<{ cohortId: string }>, onJoined?: () => void) {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const membership = await join()
      return findCohort(membership.cohortId)
    },
    onSuccess: (cohort) => {
      onJoined?.()
      if (!cohort) {
        navigate({ to: '/classes' })
        return
      }
      toast.success(`Você entrou em ${cohort.name}.`)
      navigate({
        to: '/classes/$cohortRef',
        params: { cohortRef: cohortAddress(cohort) },
        replace: true,
      })
    },
  })
}
