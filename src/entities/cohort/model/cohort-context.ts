import { createContext, useContext } from 'react'
import type { Cohort } from '@/shared/api/cohorts'

export type CohortView = {
  cohort: Cohort
  /** The signed-in profile. */
  profileId: string
  /** Created the cohort: edits it, changes its status, deletes it. */
  isOwner: boolean
  /**
   * Teaches in it: manages members, codes and invitations. A member's role
   * follows their profile type, so a faculty profile that can see the
   * cohort is one of its faculty.
   */
  isFaculty: boolean
}

const CohortContext = createContext<CohortView | null>(null)

export const CohortProvider = CohortContext.Provider

/** The cohort the current page belongs to; set by the cohort layout. */
export function useCohortView() {
  const view = useContext(CohortContext)

  if (!view) throw new Error('useCohortView must be used inside a cohort page.')

  return view
}
