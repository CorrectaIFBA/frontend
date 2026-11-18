import { PenLine } from 'lucide-react'
import { useState } from 'react'
import { GradeCard } from '@/features/grade-attempt/ui/grade-card'
import { GradeForm } from '@/features/grade-attempt/ui/grade-form'
import { TestcaseShare } from '@/features/grade-attempt/ui/testcase-share'
import { gradeFormat } from '@/entities/grade'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { QuestionGrade } from '@/shared/api/grades'
import type { QuestionScore } from '@/shared/api/submission-results'
import { Button } from '@/shared/ui/button'

export type QuestionGradeProps = {
  assessmentId: string
  studentProfileId: string
  question: AssessmentQuestion
  number: number
  grade: QuestionGrade | undefined
  testcaseScore: QuestionScore | undefined
  isTestcaseScoreLoading: boolean
  graderName: (profileId: string | null) => string
}

/** One question: what its test cases passed, then its grade card, or the form to give or change it. */
export function QuestionGrade({
  assessmentId,
  studentProfileId,
  question,
  number,
  grade,
  testcaseScore,
  isTestcaseScoreLoading,
  graderName,
}: QuestionGradeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const maximumGrade = Number(question.maximumGrade)
  const hasScore = grade?.score !== null && grade?.score !== undefined

  return (
    <section aria-labelledby={`grade-question-${question.id}`} className="flex flex-col gap-2.5">
      <header className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate font-medium text-[13px]" id={`grade-question-${question.id}`}>
            <span className="text-muted-foreground tabular-nums">{number}.</span> {question.title}
          </h3>
          <span className="shrink-0 text-muted-foreground text-xs tabular-nums">vale {gradeFormat.format(maximumGrade)}</span>
        </div>
        <TestcaseShare isLoading={isTestcaseScoreLoading} score={testcaseScore} />
      </header>

      {isEditing ? (
        <GradeForm
          assessmentId={assessmentId}
          grade={grade}
          maximumGrade={maximumGrade}
          onDone={() => setIsEditing(false)}
          questionId={question.id}
          studentProfileId={studentProfileId}
          testcasePercentage={testcaseScore?.percentage ?? null}
        />
      ) : grade && hasScore ? (
        <GradeCard
          action={
            <Button aria-label="Editar nota" onClick={() => setIsEditing(true)} size="icon-sm" variant="ghost-muted">
              <PenLine />
            </Button>
          }
          comment={grade.comment}
          gradedAt={grade.gradedAt}
          graderName={graderName(grade.gradedByProfileId)}
          maximumGrade={maximumGrade}
          score={grade.score}
        />
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border border-dashed px-3.5 py-2.5">
          <span className="text-muted-foreground text-xs">Sem nota</span>
          <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
            Atribuir nota
          </Button>
        </div>
      )}
    </section>
  )
}
