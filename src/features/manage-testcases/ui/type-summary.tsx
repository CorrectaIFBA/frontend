import { TYPE_INFO } from '@/features/manage-testcases/config/testcase-types'
import { type Testcase, TESTCASE_TYPES } from '@/shared/api/assessments'

/** How many of each type, so the mix reads at a glance. */
export function TypeSummary({ testcases }: { testcases: Testcase[] }) {
  return (
    <span className="hidden items-center gap-2.5 text-muted-foreground text-xs tabular-nums sm:flex">
      {TESTCASE_TYPES.map((type) => {
        const count = testcases.filter((testcase) => testcase.type === type).length
        if (!count) return null
        const Icon = TYPE_INFO[type].icon
        return (
          <span className="flex items-center gap-1" key={type} title={`${count} ${TYPE_INFO[type].label.toLowerCase()}`}>
            <Icon className="size-3.5" /> {count}
          </span>
        )
      })}
    </span>
  )
}
