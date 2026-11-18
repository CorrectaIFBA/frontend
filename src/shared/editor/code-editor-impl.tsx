import Editor from '@monaco-editor/react'
import { useEffect, useRef } from 'react'
import type { ProgrammingLanguage } from '@/shared/api/assessments'
import { FONT } from '@/shared/editor/editor-font'
import { MONACO_LANGUAGE } from '@/shared/editor/languages'
import { watchDiagnostics } from '@/shared/editor/monaco'
import { type PasteReport, usePasteGuard } from '@/shared/editor/use-paste-guard'
import { cn } from '@/shared/lib/cn'
import { useTheme } from '@/shared/lib/theme-provider'

export type CodeEditorProps = {
  language: ProgrammingLanguage
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  /** Fixed height in pixels, or any CSS height such as `100%`; the editor scrolls past it. */
  height?: number | string
  ariaLabel?: string
  className?: string
  /**
   * Refuses pasted and dropped text unless it was copied or cut inside an editor on this page.
   * A barrier for the interface, not a security boundary.
   */
  blockPaste?: boolean
  /** Underlines clang's errors and warnings as the code changes. */
  diagnostics?: boolean
  /** Every paste or drop into the editor, refused or not. */
  onPaste?: (paste: PasteReport) => void
}

export default function CodeEditorImpl({
  language,
  value,
  onChange,
  readOnly,
  height = 420,
  ariaLabel,
  className,
  blockPaste,
  onPaste,
  diagnostics = false,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const frame = useRef<HTMLDivElement>(null)

  usePasteGuard(frame, { blockPaste, onPaste })

  const diagnosticsOn = useRef(diagnostics)
  diagnosticsOn.current = diagnostics
  const watcher = useRef<ReturnType<typeof watchDiagnostics> | null>(null)

  useEffect(() => () => watcher.current?.dispose(), [])
  // Turning them off clears the marks at once; turning them on asks again.
  useEffect(() => {
    watcher.current?.refresh()
  }, [diagnostics])

  return (
    <div className={cn('overflow-hidden', className)} ref={frame} style={{ height }}>
      <Editor
        onMount={(editor) => {
          if (!readOnly) watcher.current = watchDiagnostics(editor, () => diagnosticsOn.current)
        }}
        language={MONACO_LANGUAGE[language]}
        loading={null}
        onChange={(next) => onChange?.(next ?? '')}
        options={{
          ariaLabel,
          readOnly,
          fontFamily: FONT,
          fontSize: 13,
          lineHeight: 20,
          fontLigatures: false,
          tabSize: 4,
          insertSpaces: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: readOnly ? 'none' : 'line',
          quickSuggestions: { other: true, comments: false, strings: false },
          suggestOnTriggerCharacters: true,
          wordBasedSuggestions: 'currentDocument',
          tabCompletion: 'on',
          snippetSuggestions: 'inline',
          bracketPairColorization: { enabled: true },
          guides: { indentation: true, bracketPairs: false },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10, alwaysConsumeMouseWheel: false },
          stickyScroll: { enabled: false },
          domReadOnly: readOnly,
          // The context menu pastes through the clipboard API, past the listeners above.
          contextmenu: !blockPaste,
        }}
        theme={resolvedTheme === 'dark' ? 'correcta-dark' : 'correcta-light'}
        value={value}
      />
    </div>
  )
}
