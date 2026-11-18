import { useState } from 'react'
import { useGradeSheetData } from '@/features/grade-attempt/model/use-grade-sheet-data'
import { GradeHistory } from '@/features/grade-attempt/ui/grade-history'
import { GradeLedger } from '@/features/grade-attempt/ui/grade-ledger'
import { QuestionGrade } from '@/features/grade-attempt/ui/question-grade'
import { errorMessage } from '@/shared/api/errors'
import { PanelNote } from '@/shared/ui/panel-note'
import { Segmented } from '@/shared/ui/segmented'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet'
import { Skeleton } from '@/shared/ui/skeleton'

type View = 'questions' | 'history'

export type GradeSheetProps = {
  assessmentId: string
  /** `null` keeps the sheet closed. */
  studentProfileId: string | null
  studentName: string
  onClose: () => void
}

/** Faculty grade each question of one student's attempt, with a comment, and read every grade given so far. */
export function GradeSheet({ assessmentId, studentProfileId, studentName, onClose }: GradeSheetProps) {
  const [view, setView] = useState<View>('questions')
  const data = useGradeSheetData(assessmentId, studentProfileId ?? '', Boolean(studentProfileId))

  return (
    <Sheet
      onOpenChange={(open) => {
        if (open) return
        onClose()
        setView('questions')
      }}
      open={Boolean(studentProfileId)}
    >
      <SheetContent className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="border-border border-b">
          <SheetTitle>Notas de {studentName}</SheetTitle>
          <SheetDescription>Uma nota por questão. A nota da atividade é a média delas.</SheetDescription>
        </SheetHeader>

        {data.error ? (
          <div className="p-4">
            <PanelNote>{errorMessage(data.error)}</PanelNote>
          </div>
        ) : !data.questions ? (
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            <GradeLedger gradesByQuestionId={data.gradesByQuestionId} questions={data.questions} />
            <div className="flex border-border border-b px-4 py-2.5">
              <Segmented
                label="Mostrar"
                onChange={setView}
                options={[
                  { value: 'questions', label: 'Questões' },
                  { value: 'history', label: 'Registro' },
                ]}
                value={view}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {view === 'questions' ? (
                data.questions.length ? (
                  <div className="flex flex-col gap-6">
                    {data.questions.map((question, index) => (
                      <QuestionGrade
                        assessmentId={assessmentId}
                        grade={data.gradesByQuestionId.get(question.id)}
                        graderName={data.graderName}
                        isTestcaseScoreLoading={data.isTestcaseScoreLoading}
                        key={question.id}
                        number={index + 1}
                        question={question}
                        studentProfileId={studentProfileId ?? ''}
                        testcaseScore={data.testcaseScoresByQuestionId.get(question.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <PanelNote>Esta atividade não tem questões.</PanelNote>
                )
              ) : data.logsError ? (
                <PanelNote>{errorMessage(data.logsError)}</PanelNote>
              ) : data.logs ? (
                <GradeHistory graderName={data.graderName} logs={data.logs} questions={data.questions} />
              ) : (
                <Skeleton className="h-24 w-full" />
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
