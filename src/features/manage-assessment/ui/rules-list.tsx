import { describeRules } from '@/entities/assessment'
import type { Assessment } from '@/shared/api/assessments'

export function RulesList({ assessment, forStudent }: { assessment: Assessment; forStudent: boolean }) {
  const rules = describeRules(assessment.parameters, forStudent)

  if (!rules.length) {
    return <p className="p-4 text-muted-foreground text-xs">Nenhuma regra definida.</p>
  }

  return (
    <ul className="divide-y divide-border/70 px-4">
      {rules.map((rule) => (
        <li className="flex gap-3 py-3" key={rule.label}>
          <rule.icon className="mt-0.5 size-4 shrink-0 text-(--cohort-ink)" strokeWidth={1.75} />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-[13px]">{rule.label}</span>
            <span className="text-muted-foreground text-xs leading-relaxed">{rule.detail}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
