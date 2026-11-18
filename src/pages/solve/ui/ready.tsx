import { Outlet } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useCohortView } from '@/entities/cohort'
import { useCodingSession } from '@/entities/session'
import type { DraftSyncer } from '@/entities/workspace'
import type { Assessment, AssessmentQuestion } from '@/shared/api/assessments'
import { writtenQuestions, SolveProvider, SessionEndDialog, SolveScreen } from '@/widgets/solve'

export function Ready({
  assessment,
  questions,
  coding,
  syncers,
  flushAll,
}: {
  assessment: Assessment
  questions: AssessmentQuestion[]
  coding: ReturnType<typeof useCodingSession>
  syncers: Map<string, DraftSyncer>
  flushAll: () => Promise<DraftSyncer[]>
}) {
  const { cohort } = useCohortView()
  const [written, setWritten] = useState(() => writtenQuestions(syncers, questions))

  const markWritten = useCallback((questionId: string, isWritten: boolean) => {
    setWritten((current) => {
      if (current.has(questionId) === isWritten) return current
      const next = new Set(current)
      if (isWritten) next.add(questionId)
      else next.delete(questionId)
      return next
    })
  }, [])

  return (
    <SolveProvider value={{ cohort, assessment, questions, coding, written, markWritten, syncers, flushAll }}>
      <SolveScreen>
        <Outlet />
        <SessionEndDialog />
      </SolveScreen>
    </SolveProvider>
  )
}
