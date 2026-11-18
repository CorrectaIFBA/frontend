import type { GradeLog } from '@/shared/api/grades'

/** What one saved grade did to its question, against the version before it. */
export type GradeChangeKind = 'first' | 'changed' | 'removed' | 'comment'

export type GradeHistoryEntry = {
  log: GradeLog
  kind: GradeChangeKind
  /** The score before this change; `undefined` on the first grade. */
  previousScore: number | null | undefined
}

export type GradeHistoryDay = {
  /** `YYYY-MM-DD` in local time. */
  key: string
  date: Date
  entries: GradeHistoryEntry[]
}

const localDayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

function changeKind(log: GradeLog, previous: GradeLog | undefined): GradeChangeKind {
  if (!previous) return 'first'
  if (log.score === null) return 'removed'
  if (previous.score !== null && Number(previous.score) === Number(log.score)) return 'comment'

  return 'changed'
}

/** The logs, newest first, grouped by local day; each entry knows what it changed. */
export function historyDays(logs: GradeLog[]): GradeHistoryDay[] {
  const days: GradeHistoryDay[] = []

  logs.forEach((log, index) => {
    const previous = logs.slice(index + 1).find((older) => older.questionId === log.questionId)
    const date = new Date(log.createdAt)
    const key = localDayKey(date)
    const entry: GradeHistoryEntry = {
      log,
      kind: changeKind(log, previous),
      previousScore: previous ? (previous.score === null ? null : Number(previous.score)) : undefined,
    }
    const lastDay = days.at(-1)

    if (lastDay?.key === key) lastDay.entries.push(entry)
    else days.push({ key, date, entries: [entry] })
  })

  return days
}

/** “Hoje”, “Ontem” or the date, for a day heading. */
export function dayLabel(date: Date, now = new Date()) {
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (localDayKey(date) === localDayKey(now)) return 'Hoje'
  if (localDayKey(date) === localDayKey(yesterday)) return 'Ontem'

  return dayFormat.format(date)
}

const dayFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const timeFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
