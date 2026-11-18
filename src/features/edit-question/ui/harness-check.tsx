import { CircleCheck, CircleDashed } from 'lucide-react'
import { useMemo } from 'react'
import { Issue } from '@/features/edit-question/ui/harness-issue'
import { checkHarness, signatureText } from '@/shared/lib/c-signatures'

/*
  The harness and the draft have to agree on the functions the student
  writes. Checked on every keystroke, both ways: what the harness expects
  that the draft lacks, and what the draft offers that the harness ignores.
*/
export function HarnessCheck({ harness, draft }: { harness: string; draft: string }) {
  const report = useMemo(() => checkHarness(harness, draft), [harness, draft])
  const errors = report.issues.filter((issue) => issue.severity === 'error').length
  const warnings = report.issues.length - errors

  if (report.state === 'idle') {
    return (
      <div className="flex items-center gap-2 border-border border-t bg-muted/40 px-4 py-2.5 text-muted-foreground text-xs">
        <CircleDashed aria-hidden className="size-3.5 shrink-0" />
        Sem harness, o código do estudante roda como está.
      </div>
    )
  }

  if (report.state === 'ok') {
    return (
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1 border-border border-t bg-success/8 px-4 py-2.5 text-xs"
        role="status"
      >
        <CircleCheck aria-hidden className="size-3.5 shrink-0 text-success" />
        <span className="font-medium text-success">Harness e código inicial concordam.</span>
        <span className="flex flex-wrap gap-1.5">
          {report.expected.map((fn) => (
            <code className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px]" key={fn.name}>
              {signatureText(fn)}
            </code>
          ))}
        </span>
      </div>
    )
  }

  return (
    <div className="border-border border-t" role="status">
      <div className="flex items-center gap-2 bg-muted/40 px-4 py-2 text-xs">
        <span className="font-medium">Harness × código inicial</span>
        <span className="ml-auto flex items-center gap-3 tabular-nums">
          {errors ? <span className="text-destructive">{errors === 1 ? '1 erro' : `${errors} erros`}</span> : null}
          {warnings ? (
            <span className="text-warning">{warnings === 1 ? '1 aviso' : `${warnings} avisos`}</span>
          ) : null}
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-border/70">
        {report.issues.map((issue) => (
          <Issue issue={issue} key={`${issue.code}:${issue.name}`} />
        ))}
      </ul>
    </div>
  )
}
