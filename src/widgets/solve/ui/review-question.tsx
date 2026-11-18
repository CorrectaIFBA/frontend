import { useState } from 'react'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { QuestionGrade } from '@/shared/api/grades'
import type { SubmittedWorkspace } from '@/shared/api/workspaces'
import type { QuestionResult } from '@/widgets/solve/lib/attempt-result'
import type { QuestionNavigation } from '@/widgets/solve/model/question-navigation'
import { DragHandle } from '@/widgets/solve/ui/drag-handle'
import { QuestionStatement } from '@/widgets/solve/ui/question-statement'
import { QuestionSteps } from '@/widgets/solve/ui/question-steps'
import { ReviewTestcaseColumn } from '@/widgets/solve/ui/review-testcase-column'
import { SubmittedCode } from '@/widgets/solve/ui/submitted-code'

type ReviewQuestionProps = {
  question: AssessmentQuestion
  number: number
  workspace: SubmittedWorkspace | undefined
  showsEveryTestcase: boolean
  /** `undefined` while the results load. */
  entry: QuestionResult | undefined
  navigation: QuestionNavigation
  /** The question's grade; `null` hides the grade, `undefined` says there is none yet. */
  grade: QuestionGrade | null | undefined
}

/** One question of a submitted activity, laid out like the coding page. */
export function ReviewQuestion({ question, number, workspace, showsEveryTestcase, entry, navigation, grade }: ReviewQuestionProps) {
  const [statementWidth, setStatementWidth] = useState(400)

  return (
    // Remounted per question: a brief fade marks the switch.
    <div className="flex min-h-0 flex-1 flex-col md:flex-row animate-in fade-in-0 slide-in-from-bottom-1 duration-150 ease-out motion-reduce:animate-none">
      <QuestionStatement
        footer={<QuestionSteps navigation={navigation} />}
        number={number}
        question={question}
        width={statementWidth}
      />
      <DragHandle onResize={setStatementWidth} width={statementWidth} />
      <SubmittedCode number={number} workspace={workspace} />
      <ReviewTestcaseColumn
        assessmentId={question.assessmentId}
        entry={entry}
        grade={grade}
        question={question}
        showsEveryType={showsEveryTestcase}
      />
    </div>
  )
}
