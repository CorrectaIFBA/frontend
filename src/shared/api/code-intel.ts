import { CODE_INTEL_API_URL } from '@/shared/api/http'
import { authedRequest } from '@/shared/api/session'

/*
  C diagnostics and completions from the code-intel service, which runs
  clang on the code (never the program). Each call sends the whole file.
  Lines and columns are 1-based, columns in the editor's units.
*/

export type Diagnostic = {
  severity: 'ERROR' | 'WARNING' | 'NOTE'
  message: string
  line: number
  column: number
  endLine: number
  endColumn: number
  flag: string | null
}

export type CompletionKind = 'FUNCTION' | 'VARIABLE' | 'FIELD' | 'TYPE' | 'MACRO' | 'KEYWORD' | 'SNIPPET'

export type CompletionItem = {
  label: string
  kind: CompletionKind
  detail: string | null
  signature: string | null
  /** Snippet syntax: `${1:name}` per parameter. */
  insertText: string
}

export type Signature = {
  label: string
  parameters: string[]
  activeParameter: number
  returnType: string | null
}

export const diagnoseC = (code: string, signal?: AbortSignal) =>
  authedRequest<Diagnostic[]>('/c/diagnostics', { method: 'POST', body: { code }, signal, baseUrl: CODE_INTEL_API_URL })

export const completeC = (code: string, line: number, column: number, signal?: AbortSignal) =>
  authedRequest<{ items: CompletionItem[]; signatures: Signature[] }>('/c/completions', {
    method: 'POST',
    body: { code, line, column },
    signal,
    baseUrl: CODE_INTEL_API_URL,
  })
