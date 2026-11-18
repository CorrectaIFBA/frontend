import { loader } from '@monaco-editor/react'
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution'
import 'monaco-editor/esm/vs/editor/editor.all'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { completeC, type CompletionKind, diagnoseC, type Diagnostic } from '@/shared/api/code-intel'

/*
  Monaco, bundled with the app instead of fetched from a CDN, with only what
  the draft code needs: the editor, the C grammar (only C is supported for now) and the
  base worker. Importing this module is what loads it, so it is only ever
  imported behind a lazy boundary.
*/

self.MonacoEnvironment = { getWorker: () => new EditorWorker() }

loader.config({ monaco })

export { monaco }

/* ---------------------------------------------------------------------------
   Themes: the editor sits in a card, so it takes the card's ground and the
   app's teal for the cursor and selection.
--------------------------------------------------------------------------- */

monaco.editor.defineTheme('correcta-light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '7a8a8c', fontStyle: 'italic' },
    { token: 'keyword', foreground: '7b3fa8' },
    { token: 'string', foreground: '2f7d4a' },
    { token: 'number', foreground: 'b0561e' },
    { token: 'type', foreground: '1f6f8b' },
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#22292b',
    'editorLineNumber.foreground': '#b3bcbe',
    'editorLineNumber.activeForeground': '#5d6a6c',
    'editor.lineHighlightBackground': '#f4f7f7',
    'editor.lineHighlightBorder': '#00000000',
    'editorCursor.foreground': '#127a77',
    'editor.selectionBackground': '#127a7729',
    'editorIndentGuide.background1': '#e6ebeb',
    'editorWidget.background': '#ffffff',
    'editorSuggestWidget.selectedBackground': '#127a771f',
  },
})

monaco.editor.defineTheme('correcta-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6f7d7f', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'c9a2ef' },
    { token: 'string', foreground: '96d4a6' },
    { token: 'number', foreground: 'f0b27a' },
    { token: 'type', foreground: '7fcde0' },
  ],
  colors: {
    'editor.background': '#15191a',
    'editor.foreground': '#e9eeee',
    'editorLineNumber.foreground': '#4a5557',
    'editorLineNumber.activeForeground': '#a3b0b2',
    'editor.lineHighlightBackground': '#1c2122',
    'editor.lineHighlightBorder': '#00000000',
    'editorCursor.foreground': '#7fd3cd',
    'editor.selectionBackground': '#7fd3cd33',
    'editorIndentGuide.background1': '#262c2d',
    'editorWidget.background': '#1a1f20',
    'editorSuggestWidget.selectedBackground': '#7fd3cd24',
  },
})

/* ---------------------------------------------------------------------------
   Completion. clang, through the code-intel service, knows what the code
   declares: the student's own functions, variables, struct members and the
   standard library behind each #include. When the service cannot answer,
   the keywords and snippets below still do, so the editor never goes quiet.
--------------------------------------------------------------------------- */

type Entry = { label: string; insert?: string; detail?: string; kind: 'keyword' | 'snippet' }

const C_FALLBACK: Entry[] = [
  ...[
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern',
    'float', 'for', 'goto', 'if', 'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
    'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while', 'bool', 'true', 'false', 'NULL',
  ].map((label) => ({ label, kind: 'keyword' as const })),
  { label: '#include', insert: '#include <${1:stdio.h}>', detail: 'cabeçalho', kind: 'snippet' },
  { label: 'main', insert: 'int main(void) {\n\t${1}\n\treturn 0;\n}', detail: 'função principal', kind: 'snippet' },
  { label: 'for', insert: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}', detail: 'laço', kind: 'snippet' },
  { label: 'while', insert: 'while (${1:condicao}) {\n\t${2}\n}', detail: 'laço', kind: 'snippet' },
  { label: 'if', insert: 'if (${1:condicao}) {\n\t${2}\n}', detail: 'condição', kind: 'snippet' },
  { label: 'struct', insert: 'typedef struct {\n\t${2}\n} ${1:Nome};', detail: 'tipo', kind: 'snippet' },
]

const { CompletionItemKind, CompletionItemInsertTextRule } = monaco.languages

const KIND: Record<CompletionKind, monaco.languages.CompletionItemKind> = {
  FUNCTION: CompletionItemKind.Function,
  VARIABLE: CompletionItemKind.Variable,
  FIELD: CompletionItemKind.Field,
  TYPE: CompletionItemKind.Struct,
  MACRO: CompletionItemKind.Constant,
  KEYWORD: CompletionItemKind.Keyword,
  SNIPPET: CompletionItemKind.Snippet,
}

// The service answers at most this many; a full answer may hide more, so the editor asks again as the word grows.
const MAX_ITEMS = 150

function wordRange(model: monaco.editor.ITextModel, position: monaco.Position) {
  const word = model.getWordUntilPosition(position)
  return {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  }
}

function fallback(range: monaco.IRange): monaco.languages.CompletionList {
  return {
    suggestions: C_FALLBACK.map((entry) => ({
      label: entry.label,
      kind: entry.kind === 'snippet' ? CompletionItemKind.Snippet : CompletionItemKind.Keyword,
      detail: entry.detail,
      insertText: entry.insert ?? entry.label,
      insertTextRules: entry.insert ? CompletionItemInsertTextRule.InsertAsSnippet : undefined,
      range,
    })),
  }
}

monaco.languages.registerCompletionItemProvider('c', {
  triggerCharacters: ['.', '>'],
  async provideCompletionItems(model, position, context) {
    const range = wordRange(model, position)
    // `>` only asks for members after `-`, as in `p->`
    if (context.triggerCharacter === '>' && model.getValueInRange({ ...range, startColumn: position.column - 2, endColumn: position.column }) !== '->') {
      return { suggestions: [] }
    }

    try {
      const { items } = await completeC(model.getValue(), position.lineNumber, position.column)
      return {
        incomplete: items.length >= MAX_ITEMS,
        suggestions: items.map((item, index) => ({
          label: item.signature ? { label: item.label, detail: item.signature.slice(item.label.length), description: item.detail ?? undefined } : { label: item.label, description: item.detail ?? undefined },
          kind: KIND[item.kind],
          insertText: item.insertText,
          insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
          // Keep the service's order: the case typed first, then the shorter names.
          sortText: String(index).padStart(4, '0'),
          range,
        })),
      }
    } catch {
      return fallback(range)
    }
  },
})

monaco.languages.registerSignatureHelpProvider('c', {
  signatureHelpTriggerCharacters: ['(', ','],
  signatureHelpRetriggerCharacters: [','],
  async provideSignatureHelp(model, position) {
    try {
      const { signatures } = await completeC(model.getValue(), position.lineNumber, position.column)
      if (!signatures.length) return null
      return {
        value: {
          signatures: signatures.map((signature) => ({
            label: signature.returnType ? `${signature.returnType} ${signature.label}` : signature.label,
            parameters: signature.parameters.map((parameter) => ({ label: parameter })),
          })),
          activeSignature: 0,
          activeParameter: signatures[0].activeParameter,
        },
        dispose: () => {},
      }
    } catch {
      return null
    }
  },
})

/* ---------------------------------------------------------------------------
   Diagnostics. clang's errors and warnings, drawn under the code a moment
   after typing stops. Each editor turns them on or off on its own.
--------------------------------------------------------------------------- */

const SEVERITY: Record<Diagnostic['severity'], monaco.MarkerSeverity> = {
  ERROR: monaco.MarkerSeverity.Error,
  WARNING: monaco.MarkerSeverity.Warning,
  NOTE: monaco.MarkerSeverity.Info,
}

const OWNER = 'clang'

const DIAGNOSE_DELAY_MS = 700

/** Keeps the editor's markers in step with its code while `enabled()` says so; returns the way to stop. */
export function watchDiagnostics(editor: monaco.editor.IStandaloneCodeEditor, enabled: () => boolean) {
  let timer: number | undefined
  let request: AbortController | undefined

  const clear = () => {
    const model = editor.getModel()
    if (model) monaco.editor.setModelMarkers(model, OWNER, [])
  }

  const run = () => {
    window.clearTimeout(timer)
    request?.abort()
    const model = editor.getModel()
    if (!model || model.getLanguageId() !== 'c') return
    if (!enabled()) return clear()

    timer = window.setTimeout(async () => {
      request = new AbortController()
      try {
        const diagnostics = await diagnoseC(model.getValue(), request.signal)
        if (model.isDisposed() || !enabled()) return
        monaco.editor.setModelMarkers(
          model,
          OWNER,
          diagnostics.map((diagnostic) => {
            // clang often marks a single point, such as the start of a name; the mark covers the whole word there.
            const word =
              diagnostic.endLine === diagnostic.line && diagnostic.endColumn === diagnostic.column + 1
                ? model.getWordAtPosition({ lineNumber: diagnostic.line, column: diagnostic.column })
                : null
            return {
              severity: SEVERITY[diagnostic.severity],
              message: diagnostic.message,
              code: diagnostic.flag ?? undefined,
              source: 'clang',
              startLineNumber: diagnostic.line,
              startColumn: word?.startColumn ?? diagnostic.column,
              endLineNumber: diagnostic.endLine,
              endColumn: word?.endColumn ?? diagnostic.endColumn,
            }
          })
        )
      } catch {
        // Unreachable service or a superseded request: the last markers stay until the next answer.
      }
    }, DIAGNOSE_DELAY_MS)
  }

  const subscription = editor.onDidChangeModelContent(run)
  run()

  return {
    refresh: run,
    dispose: () => {
      window.clearTimeout(timer)
      request?.abort()
      subscription.dispose()
      clear()
    },
  }
}
