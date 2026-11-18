import { FileX } from 'lucide-react'
import type { ProgrammingLanguage } from '@/shared/api/assessments'
import type { SubmittedWorkspace } from '@/shared/api/workspaces'
import { CodeEditor } from '@/shared/editor/code-editor'
import { dateTimeFormat } from '@/shared/lib/date-format'

type SubmittedCodeProps = {
  workspace: SubmittedWorkspace | undefined
  number: number
}

/** The code handed in for one question, read-only, in the coding page's editor. */
export function SubmittedCode({ workspace, number }: SubmittedCodeProps) {
  const draft = workspace?.currentDraft

  return (
    <section aria-label="Código enviado" className="flex min-h-[280px] min-w-0 flex-1 flex-col">
      <div className="flex h-9 shrink-0 items-center gap-3 border-border border-b bg-muted/30 px-3 text-xs">
        <span className="font-mono text-muted-foreground">main.c</span>
        {draft ? (
          <span className="truncate text-muted-foreground tabular-nums">
            Versão {draft.revision}, salva em {dateTimeFormat.format(new Date(draft.createdAt))}
          </span>
        ) : null}
        <span className="ml-auto text-muted-foreground">Somente leitura</span>
      </div>
      {draft ? (
        <CodeEditor
          ariaLabel={`Código enviado na questão ${number}`}
          className="min-h-0 flex-1"
          height="100%"
          language={draft.language as ProgrammingLanguage}
          readOnly
          value={draft.sourceCode}
        />
      ) : (
        <div className="m-auto flex max-w-xs flex-col items-center gap-2 p-6 text-center">
          <FileX className="size-5 text-muted-foreground" strokeWidth={1.75} />
          <p className="font-medium text-[13px]">Nenhum código enviado</p>
          <p className="text-muted-foreground text-xs">Esta questão conta como não respondida.</p>
        </div>
      )}
    </section>
  )
}
