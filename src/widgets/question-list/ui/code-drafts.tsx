import { ChevronRight, FileCode2 } from 'lucide-react'
import { useState } from 'react'
import type { CodeDraft, ProgrammingLanguage } from '@/shared/api/assessments'
import { CodeView } from '@/shared/editor/code-view'
import { LANGUAGE_LABEL } from '@/shared/editor/languages'
import { cn } from '@/shared/lib/cn'
import { lineCount } from '@/widgets/question-list/lib/line-count'

/** The starting code per allowed language, folded until asked for, one tab per language. */
export function CodeDrafts({ drafts, open, onToggle }: { drafts: CodeDraft[]; open: boolean; onToggle: () => void }) {
  const [shown, setShown] = useState<ProgrammingLanguage>(drafts[0].language)
  const current = drafts.find((draft) => draft.language === shown) ?? drafts[0]
  const lines = lineCount(current.code)

  if (drafts.every((draft) => !draft.code)) {
    return <p className="text-muted-foreground text-xs">Sem código inicial: o estudante começa do zero.</p>
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex h-8 items-center gap-2 bg-muted/40 pr-3 text-muted-foreground text-xs">
        <button
          aria-expanded={open}
          className="flex h-full cursor-pointer items-center gap-2 pl-3 transition-colors hover:text-foreground"
          onClick={onToggle}
          type="button"
        >
          <ChevronRight className={cn('size-3.5 transition-transform', open && 'rotate-90')} />
          <FileCode2 className="size-3.5" />
          Código inicial
        </button>
        {open && drafts.length > 1 ? (
          <div aria-label="Linguagem" className="ml-2 flex h-full gap-0.5" role="tablist">
            {drafts.map((draft) => (
              <button
                aria-selected={draft.language === current.language}
                className={cn(
                  'relative cursor-pointer px-2 transition-colors',
                  draft.language === current.language
                    ? 'font-medium text-foreground after:absolute after:inset-x-1.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-(--cohort-ink)'
                    : 'hover:text-foreground'
                )}
                key={draft.language}
                onClick={() => setShown(draft.language)}
                role="tab"
                type="button"
              >
                {LANGUAGE_LABEL[draft.language]}
              </button>
            ))}
          </div>
        ) : null}
        <span className="ml-auto tabular-nums">
          {open ? (lines ? `${lines} ${lines === 1 ? 'linha' : 'linhas'}` : 'vazio') : `${drafts.length} ${drafts.length === 1 ? 'linguagem' : 'linguagens'}`}
        </span>
      </div>
      {open ? (
        current.code ? (
          <CodeView className="max-h-96 border-border border-t bg-card" language={current.language} value={current.code} />
        ) : (
          <p className="border-border border-t bg-card px-3 py-2.5 text-muted-foreground text-xs">
            Sem código inicial em {LANGUAGE_LABEL[current.language]}: o estudante começa do zero.
          </p>
        )
      ) : null}
    </div>
  )
}
