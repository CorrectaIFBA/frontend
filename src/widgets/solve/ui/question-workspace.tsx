import { ClipboardX, RotateCcw } from 'lucide-react'
import { type FocusEvent as ReactFocusEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSyncState, ConflictStrip, LengthCounter, LockedStrip, SaveErrorStrip, SaveIndicator } from '@/entities/workspace'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import { CodeEditor } from '@/shared/editor/code-editor'
import { rememberQuestion } from '@/shared/lib/solve-preferences'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { starterCode } from '@/widgets/solve/lib/written-questions'
import { useSolve } from '@/widgets/solve/model/solve-context'
import { useSolveNavigation } from '@/widgets/solve/model/use-solve-navigation'
import { DragHandle } from '@/widgets/solve/ui/drag-handle'
import { QuestionStatement } from '@/widgets/solve/ui/question-statement'
import { QuestionSteps } from '@/widgets/solve/ui/question-steps'
import { TestcaseColumn } from '@/widgets/solve/ui/testcase-column'

/*
  One question of a running session: the statement on the left, the editor
  filling the middle, and the test cases on the right (a column that can be folded). The
  statement column can be dragged wider or narrower.
*/
export function QuestionWorkspace({ question, number }: { question: AssessmentQuestion; number: number }) {
  const { assessment, coding, markWritten, syncers } = useSolve()
  const { session } = coding
  const syncer = syncers.get(question.id)
  const sync = useSyncState(syncer)
  const running = session.state === 'IN_PROGRESS'
  const editable = running && sync.state !== 'locked' && !sync.busy
  const starter = starterCode(question)
  const language = question.codeDrafts[0]?.language ?? 'C'
  const [code, setCode] = useState(() => syncer?.text()?.code ?? starter)
  const [statementWidth, setStatementWidth] = useState(400)
  const navigation = useSolveNavigation(question.id)

  useEffect(() => {
    rememberQuestion(session.id, question.slug)
  }, [session.id, question.slug])

  useEffect(() => {
    markWritten(question.id, code !== starter)
  }, [code, question.id, starter, markWritten])

  // Switching question saves at once instead of waiting for the debounce.
  useEffect(() => () => void syncer?.flush().catch(() => {}), [syncer])

  const change = (next: string) => {
    setCode(next)
    syncer?.edit({ code: next, language })
  }

  // Focus leaving the editor saves at once.
  const onBlur = (event: ReactFocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
    void syncer?.flush().catch(() => {})
  }

  const onPaste = ({ blocked }: { blocked: boolean }) => {
    if (blocked) toast.error('Esta questão só permite colar trechos do seu próprio código.')
  }

  return (
    // Remounted per question: a brief fade marks the switch.
    <div className="flex min-h-0 flex-1 flex-col md:flex-row animate-in fade-in-0 slide-in-from-bottom-1 duration-150 ease-out motion-reduce:animate-none">
      <QuestionStatement
        footer={<QuestionSteps navigation={navigation} />}
        number={number}
        question={question}
        width={statementWidth}
      >
        {!question.allowCopyPasting ? (
          <p className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
            <ClipboardX className="size-3.5" /> Só é permitido colar trechos do seu próprio código.
          </p>
        ) : null}
      </QuestionStatement>
      <DragHandle onResize={setStatementWidth} width={statementWidth} />

      <section aria-label="Editor de código" className="flex min-h-[280px] min-w-0 flex-1 flex-col" onBlur={onBlur}>
        <div className="flex h-9 shrink-0 items-center gap-3 border-border border-b bg-muted/30 px-3">
          <span className="font-mono text-muted-foreground text-xs">main.c</span>
          {running ? <SaveIndicator snapshot={sync} /> : <span className="text-muted-foreground text-xs">Somente leitura</span>}
          <LengthCounter length={code.length} />
          <div className="ml-auto flex items-center gap-1.5">
            {editable && code !== starter ? (
              <ConfirmDialog
                action={async () => change(starter)}
                confirmLabel="Restaurar"
                description="O código no editor volta ao código inicial. As revisões salvas continuam no servidor."
                destructive
                successMessage="Código inicial restaurado."
                title="Restaurar o código inicial?"
                trigger={
                  <Button size="xs" variant="ghost-muted">
                    <RotateCcw /> Código inicial
                  </Button>
                }
              />
            ) : null}
          </div>
        </div>
        {syncer ? (
          <>
            <ConflictStrip
              onUseTheirs={(draft) => {
                const next = draft?.code ?? starter
                setCode(next)
                toast.success('O código da outra janela foi carregado.')
              }}
              syncer={syncer}
            />
            <LockedStrip syncer={syncer} />
            <SaveErrorStrip syncer={syncer} />
          </>
        ) : null}
        <CodeEditor
          ariaLabel={`Código da questão ${number}`}
          blockPaste={!question.allowCopyPasting}
          // Faculty decide whether errors show while writing; off, they wait for the submission.
          diagnostics={running && (assessment.parameters?.showCompilationErrors ?? true)}
          className="min-h-0 flex-1"
          height="100%"
          language={question.codeDrafts[0]?.language ?? 'C'}
          onChange={change}
          onPaste={onPaste}
          readOnly={!editable}
          value={code}
        />
      </section>

      <TestcaseColumn question={question} />
    </div>
  )
}
