import { createContext, useContext } from 'react'
import type { CodingSession } from '@/entities/session'
import type { DraftSyncer } from '@/entities/workspace'
import type { Assessment, AssessmentQuestion } from '@/shared/api/assessments'
import type { Cohort } from '@/shared/api/cohorts'

/* ---------------------------------------------------------------------------
   What the coding pages share: the activity, its questions, the running
   session, and which questions already have code of the student's own.
--------------------------------------------------------------------------- */

export type SolveContext = {
  cohort: Cohort
  assessment: Assessment
  questions: AssessmentQuestion[]
  coding: CodingSession
  /** Ids of the questions whose code differs from the starting draft. */
  written: Set<string>
  markWritten: (questionId: string, written: boolean) => void
  /** Each question's workspace on the workspace service, by question id. */
  syncers: Map<string, DraftSyncer>
  /** Saves every question; resolves with the ones that could not be saved. */
  flushAll: () => Promise<DraftSyncer[]>
}

const Context = createContext<SolveContext | null>(null)

export const SolveProvider = Context.Provider

export function useSolve() {
  const value = useContext(Context)
  if (!value) throw new Error('useSolve must be used inside the coding page.')
  return value
}
