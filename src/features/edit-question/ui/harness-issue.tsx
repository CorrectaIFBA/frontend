import { CircleAlert, TriangleAlert } from 'lucide-react'
import { Signature } from '@/features/edit-question/ui/harness-signature'
import type { HarnessIssue } from '@/shared/lib/c-signatures'
import { cn } from '@/shared/lib/cn'

export function Issue({ issue }: { issue: HarnessIssue }) {
  const error = issue.severity === 'error'
  const Icon = error ? CircleAlert : TriangleAlert
  return (
    <li className="flex gap-2.5 px-4 py-2.5">
      <Icon aria-hidden className={cn('mt-0.5 size-3.5 shrink-0', error ? 'text-destructive' : 'text-warning')} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-xs leading-relaxed">{issue.message}</p>
        {issue.harness || issue.draft ? (
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-[11.5px]">
            {issue.harness ? <Signature label="harness" tone={error ? 'bad' : 'plain'} value={issue.harness} /> : null}
            {issue.draft ? <Signature label="código" tone={error ? 'bad' : 'plain'} value={issue.draft} /> : null}
          </dl>
        ) : null}
      </div>
    </li>
  )
}
