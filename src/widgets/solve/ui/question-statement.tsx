import type { CSSProperties, ReactNode } from 'react'
import { formatGrade } from '@/entities/assessment'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import { Markdown } from '@/shared/ui/markdown'

type QuestionStatementProps = {
  question: AssessmentQuestion
  number: number
  /** Pixels on desktop; dragged by the handle beside it. */
  width: number
  /** Notes between the title and the statement. */
  children?: ReactNode
  /** Pinned under the statement, outside its scroll: the way to the other questions. */
  footer?: ReactNode
}

/** The statement column left of the editor. The statement scrolls; the footer stays at the bottom. */
export function QuestionStatement({ question, number, width, children, footer }: QuestionStatementProps) {
  return (
    <aside
      className="flex max-h-[40svh] shrink-0 flex-col border-border border-b md:max-h-none md:w-(--statement-width) md:border-r md:border-b-0"
      style={{ '--statement-width': `${width}px` } as CSSProperties}
    >
      <article className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs tabular-nums">
            Questão {number} · {formatGrade(Number(question.maximumGrade))}
          </span>
          <h2 className="font-semibold text-[17px] leading-snug tracking-[-0.02em]">{question.title}</h2>
        </div>
        {children}
        <Markdown className="text-[14px]">{question.statement}</Markdown>
      </article>
      {footer}
    </aside>
  )
}
