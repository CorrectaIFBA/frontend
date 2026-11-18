import { gradeFormat } from '@/entities/grade'
import { AccountAvatar } from '@/entities/profile'
import { type GradeChangeKind, type GradeHistoryEntry as Entry, timeFormat } from '@/features/grade-attempt/lib/history-days'
import { cn } from '@/shared/lib/cn'
import { dateTimeFormat } from '@/shared/lib/date-format'

export type GradeHistoryEntryProps = {
  entry: Entry
  questionLabel: string
  maximumGrade: number | undefined
  graderName: string
  /** The oldest entry of the whole history: the rail stops at its node. */
  isLast: boolean
}

const KIND_LABEL: Record<GradeChangeKind, string> = {
  first: 'Primeira nota',
  changed: 'Nota alterada',
  removed: 'Nota removida',
  comment: 'Comentário editado',
}

/* The node tells the kind apart before the words do: solid for a first grade, ring for a change, hollow for a removal. */
const NODE_CLASS: Record<GradeChangeKind, string> = {
  first: 'border-(--cohort-ink) bg-(--cohort-ink)',
  changed: 'border-(--cohort-ink) bg-background',
  removed: 'border-muted-foreground/50 border-dashed bg-background',
  comment: 'border-border bg-muted',
}

/** One saved grade on the timeline: when, who, which question, and what it changed. */
export function GradeHistoryEntry({ entry, questionLabel, maximumGrade, graderName, isLast }: GradeHistoryEntryProps) {
  const { log, kind, previousScore } = entry
  const createdAt = new Date(log.createdAt)

  return (
    <li className={cn('relative pl-7', isLast ? 'pb-0' : 'pb-5')}>
      {isLast ? null : <span aria-hidden className="absolute top-4 bottom-0 left-[6.5px] w-0.5 bg-border" />}
      <span aria-hidden className={cn('absolute top-1 left-0 size-4 rounded-full border-2', NODE_CLASS[kind])} />

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <time className="font-medium text-[13px] tabular-nums" dateTime={log.createdAt} title={dateTimeFormat.format(createdAt)}>
          {timeFormat.format(createdAt)}
        </time>
        <span className="font-medium text-[13px]">{KIND_LABEL[kind]}</span>
        <span className="min-w-0 truncate text-muted-foreground text-xs">{questionLabel}</span>
      </div>

      <div className="mt-2 flex flex-col gap-2 rounded-md border border-border bg-card px-3 py-2.5">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
          {previousScore !== undefined && kind !== 'comment' ? (
            <span className="text-muted-foreground text-sm">
              {previousScore === null ? 'sem nota' : <s>{gradeFormat.format(previousScore)}</s>}
              <span className="mx-1.5">para</span>
            </span>
          ) : null}
          {log.score === null ? (
            <span className="text-muted-foreground text-sm">sem nota</span>
          ) : (
            <span className="flex items-baseline gap-1">
              <span className="font-semibold text-[20px] leading-none tracking-[-0.03em]">{gradeFormat.format(Number(log.score))}</span>
              {maximumGrade !== undefined ? (
                <span className="text-muted-foreground text-xs">de {gradeFormat.format(maximumGrade)}</span>
              ) : null}
            </span>
          )}
        </p>
        {log.comment ? (
          <p className="whitespace-pre-wrap border-border border-l-2 pl-2.5 text-[13px] leading-relaxed">{log.comment}</p>
        ) : null}
        <footer className="flex items-center gap-2 text-muted-foreground text-xs">
          <AccountAvatar className="size-5" fallbackClassName="text-[9px]" name={graderName} type="FACULTY" variant="soft" />
          <span className="min-w-0 truncate text-foreground">{graderName}</span>
        </footer>
      </div>
    </li>
  )
}
