/* ---------------------------------------------------------------------------
   What the browser keeps for a session. Each read and write is guarded:
   storage may be full, blocked or gone, and the session must still work.
--------------------------------------------------------------------------- */

function read(storage: () => Storage, key: string) {
  try {
    return storage().getItem(key)
  } catch {
    return null
  }
}

function write(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value)
  } catch {
    // Without storage the value lives only as long as the page.
  }
}

export function lastQuestionSlug(sessionId: string) {
  return read(() => localStorage, `correcta:session-question:${sessionId}`)
}

export function rememberQuestion(sessionId: string, questionSlug: string) {
  write(() => localStorage, `correcta:session-question:${sessionId}`, questionSlug)
}

const draftKey = (sessionId: string, questionId: string) => `correcta:session-draft:${sessionId}:${questionId}`

/** Code written before workspace-service stored drafts, kept only in this browser. Read once to migrate it to the server. */
export function savedDraft(sessionId: string, questionId: string) {
  return read(() => localStorage, draftKey(sessionId, questionId))
}

/** Whether the student keeps the test cases column open. Open unless they hid it. */
export function testcasesPinned(): boolean {
  return read(() => localStorage, 'correcta:testcases-panel') !== 'hidden'
}

/** Width the student dragged the test cases column to, in pixels; `null` until they do. */
export function testcasesWidth(): number | null {
  const value = Number(read(() => localStorage, 'correcta:testcases-width'))
  return Number.isFinite(value) && value > 0 ? value : null
}

export function rememberTestcasesWidth(width: number) {
  write(() => localStorage, 'correcta:testcases-width', String(Math.round(width)))
}

export function rememberTestcasesPinned(pinned: boolean) {
  write(() => localStorage, 'correcta:testcases-panel', pinned ? 'pinned' : 'hidden')
}
