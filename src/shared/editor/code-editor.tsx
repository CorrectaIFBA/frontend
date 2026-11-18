import { lazy, Suspense } from 'react'
import type { CodeEditorProps } from '@/shared/editor/code-editor-impl'
import { cn } from '@/shared/lib/cn'
import { Skeleton } from '@/shared/ui/skeleton'

/*
  Monaco is a few megabytes, so it loads only when a page shows code. Until
  then the source appears as plain text in the same box.
*/

const LazyEditor = lazy(() => import('@/shared/editor/code-editor-impl'))

/** The draft code editor: syntax highlighting and completion for the question's language. */
export function CodeEditor(props: CodeEditorProps) {
  return (
    <Suspense fallback={<Skeleton className={cn('rounded-none', props.className)} style={{ height: props.height ?? 420 }} />}>
      <LazyEditor {...props} />
    </Suspense>
  )
}
