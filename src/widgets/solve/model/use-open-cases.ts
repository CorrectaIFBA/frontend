import { useState } from 'react'
import type { Testcase } from '@/shared/api/assessments'

/** A case shows its values only when the service sent them; the private ones of a student come empty. */
export const canOpenCase = (testcase: Testcase) => testcase.input !== null || testcase.expectedOutput !== null

/*
  Which test cases are expanded, so the column header can collapse or expand
  them all at once. Every case starts collapsed.
*/
export function useOpenCases(cases: Testcase[]) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())
  const openableIds = cases.filter(canOpenCase).map((testcase) => testcase.id)
  const hasOpen = openableIds.some((id) => openIds.has(id))

  const toggleCase = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current)

      if (next.has(id)) next.delete(id)
      else next.add(id)

      return next
    })

  // Collapses everything when any case is open; otherwise expands them all.
  const toggleAll = () => setOpenIds(hasOpen ? new Set() : new Set(openableIds))

  return { openIds, hasOpen, canToggleAll: openableIds.length > 0, toggleCase, toggleAll }
}

export type OpenCasesState = ReturnType<typeof useOpenCases>
