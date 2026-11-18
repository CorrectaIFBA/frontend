import { TYPE_INFO } from '@/features/manage-testcases'
import type { TestcaseType } from '@/shared/api/assessments'

export function TestcaseTypeTag({ type }: { type: TestcaseType }) {
  const { label, icon: Icon } = TYPE_INFO[type]

  return (
    <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <Icon className="size-3" />
      {label}
    </span>
  )
}
