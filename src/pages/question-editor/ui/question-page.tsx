import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useCohortView } from '@/entities/cohort'
import { type Assessment, assessmentBySlugQueryOptions } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { BackLink } from '@/shared/ui/back-link'
import { PanelNote } from '@/shared/ui/panel-note'
import { Skeleton } from '@/shared/ui/skeleton'

/** The frame of a question page: the way back to its activity, and the activity itself. */
export function QuestionPage({
  assessmentSlug,
  children,
}: {
  assessmentSlug: string
  children: (assessment: Assessment, manageable: boolean) => ReactNode
}) {
  const { cohort, isFaculty } = useCohortView()
  const query = useQuery(assessmentBySlugQueryOptions(cohort.id, assessmentSlug))

  return (
    <div className="flex flex-col gap-4">
      <BackLink
        label={query.data ? query.data.title : 'Atividade'}
        params={{ cohortRef: cohortAddress(cohort), assessmentSlug }}
        to="/classes/$cohortRef/activities/$assessmentSlug"
      />
      {query.isError ? (
        <PanelNote>{errorMessage(query.error)}</PanelNote>
      ) : query.isPending ? (
        <Skeleton className="h-[520px] w-full rounded-lg" />
      ) : (
        children(query.data, isFaculty && cohort.status === 'ACTIVE')
      )}
    </div>
  )
}
