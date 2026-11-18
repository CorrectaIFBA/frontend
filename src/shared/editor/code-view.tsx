import { lazy, Suspense } from 'react'
import type { ProgrammingLanguage } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'

const LazyView = lazy(() =>
  import('@/shared/editor/code-view-impl').then((module) => ({ default: module.CodeViewImpl }))
)

/** Highlighted, read-only code. */
export function CodeView({
  language,
  value,
  className,
}: {
  language: ProgrammingLanguage
  value: string
  className?: string
}) {
  return (
    <Suspense
      fallback={
        <pre className={cn('overflow-x-auto p-3 font-mono text-[12.5px] leading-5', className)}>
          <code>{value}</code>
        </pre>
      }
    >
      <LazyView className={className} language={language} value={value} />
    </Suspense>
  )
}
