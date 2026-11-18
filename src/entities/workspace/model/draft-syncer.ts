import { ApiError, NetworkError } from '@/shared/api/errors'
import { backoff, getWorkspace, MAX_CODE_LENGTH, postRun, putDraft, RETRYABLE, sleep, type Workspace } from '@/shared/api/workspaces'

/*
  Keeps one workspace's code in step with the service, following
  workspace-service/docs/frontend-integration-guide.md (section 4):

  - every edit restarts a 2 s trailing debounce; blur, hiding the tab,
    switching question and submitting flush at once;
  - one PUT at a time per workspace (single-flight), always with the last
    ETag seen;
  - a 412 is reconciled with a GET: if the service already holds our text,
    our earlier write landed and its answer was lost; otherwise another
    window saved, and the student chooses whose text wins;
  - unsaved text is mirrored in localStorage until the service confirms it.

  It knows nothing about React: the page reads it through `subscribe` and
  `snapshot`, as `useSyncExternalStore` expects.
*/

export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'offline' | 'conflict' | 'locked' | 'error'

export type Draft = { code: string; language: string }

export type SyncSnapshot = {
  state: SaveState
  /** Revision the service holds; `0` before the first save. */
  revision: number
  /** Revision of the last submission this browser confirmed; `null` if none. */
  submittedRevision: number | null
  /** The other window's text while `state` is `conflict`. */
  remote: { draft: Draft | null; revision: number } | null
  /** A submit is running: the editor waits. */
  busy: boolean
  /** Why the last save failed, while `state` is `error`. */
  error: string | null
  /** The editor holds more than the service accepts; nothing is saved until it shrinks. */
  tooLong: boolean
  run: RunState
}

export type RunState =
  | { status: 'idle' }
  | { status: 'running'; revision: number }
  /** The service took the run; its results have no contract yet. */
  | { status: 'accepted'; revision: number }
  | { status: 'failed'; message: string }

const DEBOUNCE_MS = 2000

const BACKUP_DEBOUNCE_MS = 300

const MAX_SAVE_RETRIES = 5

/** `keepalive` bodies are capped near 64 KiB; past that the backup covers the page closing. */
const KEEPALIVE_LIMIT = 60_000

export class ConflictError extends Error {
  constructor() {
    super('Uma versão mais nova desta resposta foi salva em outra janela ou dispositivo.')
    this.name = 'ConflictError'
  }
}

export class LockedError extends Error {
  constructor() {
    super('O prazo de envio terminou. O código ficou somente leitura.')
    this.name = 'LockedError'
  }
}

export class OfflineError extends Error {
  constructor() {
    super('Sem conexão. O código continua guardado neste navegador.')
    this.name = 'OfflineError'
  }
}

export const sameDraft = (first: Draft | null, second: Draft | null) =>
  first !== null && second !== null && first.code === second.code && first.language === second.language

const draftOf = (workspace: Workspace): Draft | null =>
  workspace.currentDraft ? { code: workspace.currentDraft.sourceCode, language: workspace.currentDraft.language } : null

/* ---------------------------------------------------------------------------
   What the browser keeps per workspace. Storage may be full or blocked; the
   editor must keep working without it.
--------------------------------------------------------------------------- */

export type Backup = Draft & { baseEtag: string; savedAt: number }

const backupKey = (workspaceId: string) => `correcta:workspace-backup:${workspaceId}`

const submittedKey = (workspaceId: string) => `correcta:workspace-submitted:${workspaceId}`

export function readBackup(workspaceId: string): Backup | null {
  try {
    const raw = localStorage.getItem(backupKey(workspaceId))
    return raw ? (JSON.parse(raw) as Backup) : null
  } catch {
    return null
  }
}

function writeBackup(workspaceId: string, baseEtag: string, draft: Draft) {
  try {
    const backup: Backup = { ...draft, baseEtag, savedAt: Date.now() }
    localStorage.setItem(backupKey(workspaceId), JSON.stringify(backup))
  } catch {
    // Without storage the text lives only as long as the page.
  }
}

function clearBackup(workspaceId: string) {
  try {
    localStorage.removeItem(backupKey(workspaceId))
  } catch {
    // Nothing to clean up.
  }
}

/*
  The service does not report submissions yet (guide, section 10), so this
  browser remembers the last one it confirmed. Another browser will not know.
*/
function readSubmitted(workspaceId: string): number | null {
  try {
    const raw = localStorage.getItem(submittedKey(workspaceId))
    const value = raw === null ? Number.NaN : Number(raw)
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

function writeSubmitted(workspaceId: string, revision: number) {
  try {
    localStorage.setItem(submittedKey(workspaceId), String(revision))
  } catch {
    // Kept for this page only.
  }
}

/* ---------------------------------------------------------------------------
   The syncer
--------------------------------------------------------------------------- */

export class DraftSyncer {
  private etag: string
  private revision: number
  /** Text the service holds at `etag`; `null` before the first draft. */
  private server: Draft | null
  /** Latest text not yet confirmed by the service. */
  private pending: Draft | null = null
  private timer?: number
  private backupTimer?: number
  /** Serializes every PUT of this workspace. */
  private queue: Promise<void> = Promise.resolve()
  private listeners = new Set<() => void>()
  private current: SyncSnapshot

  readonly workspaceId: string
  readonly assessmentId: string
  readonly questionId: string

  constructor(workspaceId: string, assessmentId: string, questionId: string, workspace: Workspace, etag: string) {
    this.workspaceId = workspaceId
    this.assessmentId = assessmentId
    this.questionId = questionId
    this.etag = etag
    this.revision = workspace.currentRevision
    this.server = draftOf(workspace)
    this.current = {
      state: 'idle',
      revision: this.revision,
      submittedRevision: readSubmitted(workspaceId),
      remote: null,
      busy: false,
      error: null,
      tooLong: false,
      run: { status: 'idle' },
    }
  }

  /* ----- reading -------------------------------------------------------- */

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  snapshot = () => this.current

  currentEtag() {
    return this.etag
  }

  /** What the editor should show: unsaved text first, then the service's. */
  text(): Draft | null {
    return this.pending ?? this.server
  }

  /** Exactly what the editor shows, even past the length limit. */
  onScreen(): Draft | null {
    return this.screen ?? this.text()
  }

  private screen: Draft | null = null

  hasUnsaved() {
    return this.pending !== null && !sameDraft(this.pending, this.server)
  }

  private set(patch: Partial<SyncSnapshot>) {
    this.current = { ...this.current, revision: this.revision, ...patch }
    for (const listener of this.listeners) listener()
  }

  /* ----- writing -------------------------------------------------------- */

  /**
   * Restores text kept in this browser when the page opened. Saved on top of
   * the service's text only if the service has not moved since; otherwise
   * the student picks.
   */
  restore(backup: Backup) {
    const draft = { code: backup.code, language: backup.language }
    if (sameDraft(draft, this.server)) return clearBackup(this.workspaceId)
    if (backup.baseEtag === this.etag) return this.edit(draft)
    this.pending = draft
    this.set({ state: 'conflict', remote: { draft: this.server, revision: this.revision } })
  }

  edit(draft: Draft) {
    this.screen = draft
    const tooLong = draft.code.length > MAX_CODE_LENGTH
    if (tooLong !== this.current.tooLong) this.set({ tooLong })
    if (tooLong) return
    if (sameDraft(draft, this.text())) return
    this.pending = draft

    window.clearTimeout(this.backupTimer)
    const baseEtag = this.etag
    this.backupTimer = window.setTimeout(() => writeBackup(this.workspaceId, baseEtag, draft), BACKUP_DEBOUNCE_MS)

    // A conflict or a closed period stops autosave; the text stays in the editor and the backup.
    const { state } = this.current
    if (state === 'conflict' || state === 'locked') return
    // Mid-save or offline, the indicator keeps saying so; the timer below picks the new text up.
    if (state !== 'saving' && state !== 'offline') this.set({ state: 'dirty', error: null })

    window.clearTimeout(this.timer)
    this.timer = window.setTimeout(() => void this.flush().catch(() => {}), DEBOUNCE_MS)
  }

  /** Resolves once everything typed so far is saved; rejects if it cannot be. */
  flush({ keepalive = false }: { keepalive?: boolean } = {}): Promise<void> {
    window.clearTimeout(this.timer)
    if (this.pending) {
      // Write the backup now: the page may be closing.
      window.clearTimeout(this.backupTimer)
      writeBackup(this.workspaceId, this.etag, this.pending)
    }
    const run = this.queue.catch(() => {}).then(() => this.drain(keepalive))
    this.queue = run
    return run
  }

  private async drain(keepalive: boolean) {
    const { state } = this.current
    if (state === 'conflict') throw new ConflictError()
    if (state === 'locked') throw new LockedError()

    while (this.pending) {
      const snapshot = this.pending
      if (sameDraft(snapshot, this.server)) {
        this.pending = null
        break
      }
      this.set({ state: 'saving', error: null })
      await this.putWithRetry(snapshot, keepalive)
      if (this.pending === snapshot) this.pending = null
    }

    window.clearTimeout(this.backupTimer)
    clearBackup(this.workspaceId)
    if (this.revision > 0 || this.current.state !== 'idle') this.set({ state: 'saved', error: null })
  }

  private async putWithRetry(draft: Draft, keepalive: boolean) {
    const body = { sourceCode: draft.code, language: draft.language }
    const canKeepalive = keepalive && new Blob([JSON.stringify(body)]).size < KEEPALIVE_LIMIT

    for (let attempt = 0; ; attempt++) {
      let response: Awaited<ReturnType<typeof putDraft>>
      try {
        response = await putDraft(this.workspaceId, this.etag, body, canKeepalive && attempt === 0)
      } catch (error) {
        if (!(error instanceof NetworkError)) return this.fail(error)
        // The PUT may have landed. A retry with the old ETag answers 412, and reconcile sees our text.
        if (attempt >= MAX_SAVE_RETRIES) {
          this.set({ state: 'offline' })
          throw new OfflineError()
        }
        this.set({ state: 'offline' })
        await sleep(backoff(attempt))
        this.set({ state: 'saving' })
        continue
      }

      if (response.ok) {
        this.etag = response.etag ?? `"${response.body.revision}"`
        this.revision = response.body.revision
        this.server = draft
        return
      }
      if (response.status === 412) {
        if (await this.reconcile(draft)) return
        throw new ConflictError()
      }
      if (response.status === 403) return this.lock()
      if (RETRYABLE.has(response.status) && attempt < MAX_SAVE_RETRIES) {
        await sleep(backoff(attempt))
        continue
      }
      // 400, 404, 428 and exhausted 5xx: retrying will not help.
      return this.fail(response.body)
    }
  }

  private fail(error: unknown): never {
    const message =
      error instanceof ApiError
        ? error.status === 404
          ? 'Esta questão não foi encontrada no seu espaço de trabalho. Recarregue a página.'
          : error.status >= 500
            ? 'Falha ao salvar. O código continua neste navegador.'
            : error.message
        : error instanceof Error
          ? error.message
          : 'Não foi possível salvar.'
    this.set({ state: 'error', error: message })
    throw error instanceof Error ? error : new Error(message)
  }

  private lock(): never {
    window.clearTimeout(this.timer)
    this.set({ state: 'locked' })
    throw new LockedError()
  }

  /** After a 412: `true` when the service already holds exactly `draft`, so our earlier write landed. */
  private async reconcile(draft: Draft): Promise<boolean> {
    const response = await this.fetchWorkspace()
    const remote = draftOf(response.workspace)
    if (sameDraft(remote, draft)) {
      this.adopt(response.workspace, response.etag)
      return true
    }
    this.remoteEtag = response.etag
    this.remoteWorkspace = response.workspace
    this.set({ state: 'conflict', remote: { draft: remote, revision: response.workspace.currentRevision } })
    return false
  }

  private remoteEtag: string | null = null
  private remoteWorkspace: Workspace | null = null

  private adopt(workspace: Workspace, etag: string) {
    this.etag = etag
    this.revision = workspace.currentRevision
    this.server = draftOf(workspace)
  }

  private async fetchWorkspace() {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await getWorkspace(this.assessmentId, this.questionId)
        if (response.ok && response.etag) return { workspace: response.body, etag: response.etag }
        if (response.status === 403) return this.lock()
        if (!RETRYABLE.has(response.status) || attempt >= 3) return this.fail(response.body)
      } catch (error) {
        if (!(error instanceof NetworkError)) return this.fail(error)
        if (attempt >= 3) {
          this.set({ state: 'offline' })
          throw new OfflineError()
        }
      }
      await sleep(backoff(attempt))
    }
  }

  /* ----- conflict, resolved by the student ------------------------------ */

  /** Saves this window's text as a new revision on top of the other one. Nothing is lost: revisions are kept. */
  keepMine() {
    if (this.current.state !== 'conflict') return Promise.resolve()
    if (this.remoteWorkspace && this.remoteEtag) this.adopt(this.remoteWorkspace, this.remoteEtag)
    this.remoteWorkspace = null
    this.remoteEtag = null
    this.set({ state: 'dirty', remote: null })
    return this.flush()
  }

  /** Drops this window's text and shows the other one. */
  useTheirs(): Draft | null {
    if (this.current.state !== 'conflict') return this.text()
    if (this.remoteWorkspace && this.remoteEtag) this.adopt(this.remoteWorkspace, this.remoteEtag)
    this.remoteWorkspace = null
    this.remoteEtag = null
    this.pending = null
    this.screen = null
    window.clearTimeout(this.backupTimer)
    clearBackup(this.workspaceId)
    this.set({ state: 'saved', remote: null, tooLong: false })
    return this.server
  }

  /* ----- closed period --------------------------------------------------- */

  /** Asks the service again after a 403: faculty may have extended the deadline. */
  async recheck() {
    const response = await getWorkspace(this.assessmentId, this.questionId)
    if (!response.ok || !response.etag) return false
    const remote = draftOf(response.body)
    // Unsaved text written on top of an older revision is a conflict, not an overwrite.
    if (this.pending && response.body.currentRevision !== this.revision && !sameDraft(remote, this.pending)) {
      this.remoteWorkspace = response.body
      this.remoteEtag = response.etag
      this.set({ state: 'conflict', remote: { draft: remote, revision: response.body.currentRevision } })
      return true
    }
    this.adopt(response.body, response.etag)
    this.set({ state: this.hasUnsaved() ? 'dirty' : 'saved' })
    if (this.hasUnsaved()) void this.flush().catch(() => {})
    return true
  }

  /** Retries a save that gave up offline. */
  retry() {
    const { state } = this.current
    if ((state === 'offline' || state === 'error') && this.pending) return this.flush()
    return Promise.resolve()
  }

  /* ----- run (guide, section 7) ----------------------------------------- */

  /** Saves what is on screen, then asks the service to run that revision. Read-only on the workspace. */
  async run(onScreen: Draft) {
    if (this.current.run.status === 'running') return
    this.set({ run: { status: 'running', revision: this.revision } })
    try {
      if (this.revision === 0 && !this.pending) this.pending = onScreen
      await this.flush()
      const revision = this.revision
      this.set({ run: { status: 'running', revision } })
      const response = await postRun(this.workspaceId, this.etag)
      if (response.ok) return this.set({ run: { status: 'accepted', revision } })
      if (response.status === 403) {
        this.set({ run: { status: 'failed', message: new LockedError().message } })
        return this.lock()
      }
      if (response.status === 412) {
        await this.reconcile(this.server ?? onScreen)
        throw new ConflictError()
      }
      throw new Error(
        RETRYABLE.has(response.status) || response.status === 501
          ? 'A execução de código está indisponível. Seu código foi salvo.'
          : response.body instanceof Error
            ? response.body.message
            : `O servidor respondeu ${response.status}.`
      )
    } catch (error) {
      const message =
        error instanceof NetworkError ? 'Sem conexão. Tente executar de novo quando a conexão voltar.' : (error as Error).message
      if ((this.current.run as RunState).status === 'running') this.set({ run: { status: 'failed', message } })
    }
  }

  /** Marks the revision held now as submitted, after a submit-all confirmed it. */
  markSubmitted(revision = this.revision) {
    if (revision === 0) return
    writeSubmitted(this.workspaceId, revision)
    this.set({ submittedRevision: revision })
  }

  setBusy(busy: boolean) {
    this.set({ busy })
  }

  dispose() {
    window.clearTimeout(this.timer)
    window.clearTimeout(this.backupTimer)
    this.listeners.clear()
  }
}
