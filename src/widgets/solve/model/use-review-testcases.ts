import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { type AssessmentQuestion, testcasesQueryOptions } from '@/shared/api/assessments'
import { rememberTestcasesPinned, rememberTestcasesWidth, testcasesPinned, testcasesWidth } from '@/shared/lib/solve-preferences'
import { DEFAULT_TESTCASES_WIDTH } from '@/widgets/solve/config/workspace-layout'
import { useOpenCases } from '@/widgets/solve/model/use-open-cases'

/*
  The test cases beside a submitted answer. Students see the ones the coding
  page shows them; faculty see every type, evaluation cases included. The
  column keeps the coding page's preferences: open or hidden, and width.
*/
export function useReviewTestcases(assessmentId: string, question: AssessmentQuestion, showsEveryType: boolean) {
  const query = useQuery(testcasesQueryOptions(assessmentId, question.id))
  const cases = query.data?.filter((testcase) => showsEveryType || testcase.type !== 'EVALUATION')
  const [isOpen, setOpen] = useState(testcasesPinned)
  const [width, setWidth] = useState(() => testcasesWidth() ?? DEFAULT_TESTCASES_WIDTH)
  const [isResizing, setResizing] = useState(false)
  const openCases = useOpenCases(cases ?? [])

  const toggleOpen = () => {
    setOpen(!isOpen)
    rememberTestcasesPinned(!isOpen)
  }

  const startResize = () => setResizing(true)

  const endResize = (final: number) => {
    setResizing(false)
    rememberTestcasesWidth(final)
  }

  return { query, cases, isOpen, width, setWidth, isResizing, openCases, toggleOpen, startResize, endResize }
}

export type ReviewTestcasesState = ReturnType<typeof useReviewTestcases>
