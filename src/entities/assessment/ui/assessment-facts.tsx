import { Award, Hourglass, ListOrdered, type LucideIcon } from 'lucide-react'
import { formatGrade } from '@/entities/assessment/lib/format-grade'
import { formatMinutes } from '@/entities/assessment/lib/format-minutes'
import type { Assessment } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'

/*
  The few numbers a student plans around: how long it takes once started
  and what it is worth. Faculty also see how many questions it has.
*/
export function AssessmentFacts({
  assessment,
  showQuestionCount,
  className,
}: {
  assessment: Pick<Assessment, 'parameters' | 'questionCount' | 'totalGrade'>
  showQuestionCount: boolean
  className?: string
}) {
  const total = Number(assessment.totalGrade)
  const minutes = assessment.parameters?.maximumTimeAllowed
  const facts: { icon: LucideIcon; label: string; strong?: boolean }[] = []

  if (minutes) facts.push({ icon: Hourglass, label: formatMinutes(minutes) })
  // The student's grade has its own band on the list and its own panel on the activity page.
  if (total > 0) facts.push({ icon: Award, label: formatGrade(total) })
  if (showQuestionCount) {
    facts.push({
      icon: ListOrdered,
      label: assessment.questionCount === 1 ? '1 questão' : `${assessment.questionCount} questões`,
    })
  }

  if (!facts.length) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-3.5 gap-y-1 text-muted-foreground text-xs', className)}>
      {facts.map((fact) => (
        <li className={cn('inline-flex items-center gap-1.5', fact.strong && 'font-medium text-foreground')} key={fact.label}>
          <fact.icon className="size-3.5" strokeWidth={1.75} />
          {fact.label}
        </li>
      ))}
    </ul>
  )
}
