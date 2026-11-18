import { dayLabel, historyDays } from '@/features/grade-attempt/lib/history-days'
import { GradeHistoryEntry } from '@/features/grade-attempt/ui/grade-history-entry'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import type { GradeLog } from '@/shared/api/grades'
import { PanelNote } from '@/shared/ui/panel-note'

export type GradeHistoryProps = {
  /** Newest first, every question together. */
  logs: GradeLog[]
  questions: AssessmentQuestion[]
  graderName: (profileId: string | null) => string
}

/*
  Every grade given to the student as one timeline, newest on top, grouped by
  day. Each entry says what it did to its question (first grade, change,
  removal, comment) and shows the score it replaced.
*/
export function GradeHistory({ logs, questions, graderName }: GradeHistoryProps) {
  if (!logs.length) return <PanelNote>Nenhuma nota atribuída ainda.</PanelNote>

  const questionsById = new Map(questions.map((question, index) => [question.id, { question, number: index + 1 }]))
  const days = historyDays(logs)
  const oldestLogId = logs.at(-1)?.id

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-xs">
        {logs.length} {logs.length === 1 ? 'registro' : 'registros'}, do mais recente ao mais antigo.
      </p>
      {days.map((day) => (
        <section aria-label={dayLabel(day.date)} className="flex flex-col gap-3" key={day.key}>
          <h3 className="font-semibold text-[13px] first-letter:uppercase">{dayLabel(day.date)}</h3>
          <ol className="flex flex-col">
            {day.entries.map((entry) => {
              const question = questionsById.get(entry.log.questionId)

              return (
                <GradeHistoryEntry
                  entry={entry}
                  graderName={graderName(entry.log.updatedByProfileId)}
                  isLast={entry.log.id === oldestLogId}
                  key={entry.log.id}
                  maximumGrade={question ? Number(question.question.maximumGrade) : undefined}
                  questionLabel={question ? `Questão ${question.number}: ${question.question.title}` : 'Questão removida'}
                />
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
