import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { usePreviewExecution } from '@/entities/evaluation'
import { type AssessmentQuestion, testcasesQueryOptions } from '@/shared/api/assessments'
import { isPreviewDone } from '@/shared/api/evaluations'
import { rememberTestcasesPinned, rememberTestcasesWidth, testcasesPinned, testcasesWidth } from '@/shared/lib/solve-preferences'
import { AUTO_HIDE_MS, DEFAULT_TESTCASES_WIDTH } from '@/widgets/solve/config/workspace-layout'
import { useSolve } from '@/widgets/solve/model/solve-context'
import { useOpenCases } from '@/widgets/solve/model/use-open-cases'

/*
  The student pins the column open or hides it. A hidden column opens by
  itself when a run starts, and folds again a few seconds after the run ends,
  unless the student used it meanwhile (clicked, scrolled, typed, focused).
*/
export function useTestcaseColumn(question: AssessmentQuestion) {
  const { assessment, syncers } = useSolve()
  const syncer = syncers.get(question.id)
  const query = useQuery(testcasesQueryOptions(assessment.id, question.id))
  const visibleCases = query.data?.filter((testcase) => testcase.type !== 'EVALUATION') ?? []
  const preview = usePreviewExecution(syncer?.workspaceId)
  const execution = preview.execution
  const resultsByCaseId = new Map(execution?.testCases.map((result) => [result.testCaseId, result]))
  const isRunning = execution !== null && !isPreviewDone(execution.status)
  const compileFailed = execution?.compilationSucceeded === false
  const [isPinned, setPinned] = useState(testcasesPinned)
  const [width, setWidth] = useState(() => testcasesWidth() ?? DEFAULT_TESTCASES_WIDTH)
  const [isResizing, setResizing] = useState(false)
  const openCases = useOpenCases(visibleCases)
  const [isAutoOpen, setAutoOpen] = useState(false)
  const wasUsed = useRef(false)
  const isOpen = isPinned || isAutoOpen

  // A run starting opens a hidden column, for this run only.
  useEffect(() => {
    if (!isRunning || isPinned) return

    wasUsed.current = false
    setAutoOpen(true)
  }, [isRunning, isPinned, execution?.id])

  // ...and folds it again once the run ends, if the student left it alone. A compilation
  // error stays in view: folding it away after a few seconds would hide the one thing to read.
  useEffect(() => {
    if (!isAutoOpen || isRunning || compileFailed) return

    const timer = window.setTimeout(() => {
      if (!wasUsed.current) setAutoOpen(false)
    }, AUTO_HIDE_MS)

    return () => window.clearTimeout(timer)
  }, [isAutoOpen, isRunning, compileFailed])

  const markUsed = () => {
    wasUsed.current = true
  }

  const toggleOpen = () => {
    const next = !isOpen

    setPinned(next)
    setAutoOpen(false)
    rememberTestcasesPinned(next)
  }

  const startResize = () => setResizing(true)

  const endResize = (final: number) => {
    setResizing(false)
    rememberTestcasesWidth(final)
  }

  return {
    assessment,
    syncer,
    query,
    visibleCases,
    preview,
    execution,
    resultsByCaseId,
    compileFailed,
    width,
    setWidth,
    isResizing,
    openCases,
    isOpen,
    markUsed,
    toggleOpen,
    startResize,
    endResize,
  }
}

export type TestcaseColumnState = ReturnType<typeof useTestcaseColumn>
