import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { DraftSyncer, readBackup, type SyncSnapshot } from '@/entities/workspace/model/draft-syncer'
import type { AssessmentQuestion } from '@/shared/api/assessments'
import { NetworkError } from '@/shared/api/errors'
import { backoff, getWorkspace, mapWithConcurrency, RETRYABLE, sleep } from '@/shared/api/workspaces'
import { savedDraft } from '@/shared/lib/solve-preferences'

const BACKGROUND_RETRY_MS = 15_000

export type Workspaces =
  | { status: 'loading' }
  /** Every question has its workspace, keyed by question id. */
  | { status: 'ready'; syncers: Map<string, DraftSyncer>; flushAll: () => Promise<DraftSyncer[]> }
  /** Another tab of this browser is editing the activity; this one waits for it to close. */
  | { status: 'elsewhere' }
  /** The service answered 403: the period ended or the session does not take answers. */
  | { status: 'closed'; recheck: () => void }
  | { status: 'error'; error: unknown; retry: () => void }

/** One GET with the save policy: network and 5xx retried with backoff, any other answer returned. */
async function fetchWorkspace(assessmentId: string, questionId: string) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await getWorkspace(assessmentId, questionId)
      if (!RETRYABLE.has(response.status) || attempt >= 3) return response
    } catch (error) {
      if (!(error instanceof NetworkError) || attempt >= 3) throw error
    }
    await sleep(backoff(attempt))
  }
}

class ClosedError extends Error {}

/*
  The coding page's side of the workspace service.
  Opening the activity creates the workspace of every question up front, so
  submitting the activity always has something to submit. Only one tab per
  activity edits; the others wait, and take over when it closes.
*/
export function useWorkspaces(assessmentId: string, sessionId: string, questions: AssessmentQuestion[]): Workspaces {
  const [state, setState] = useState<Workspaces>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const syncersRef = useRef<DraftSyncer[]>([])
  const questionsRef = useRef(questions)
  questionsRef.current = questions
  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    let cancelled = false
    let release: (() => void) | undefined

    const bootstrap = async () => {
      setState({ status: 'loading' })
      try {
        const list = questionsRef.current
        const syncers = await mapWithConcurrency(list, 4, async (question) => {
          const response = await fetchWorkspace(assessmentId, question.id)
          if (response.status === 403) throw new ClosedError()
          if (!response.ok || !response.etag) throw response.body
          const workspace = response.body
          const syncer = new DraftSyncer(workspace.id, assessmentId, question.id, workspace, response.etag)

          const language = question.codeDrafts[0]?.language ?? 'C'
          const backup = readBackup(workspace.id)
          const legacy = savedDraft(sessionId, question.id)
          if (backup) {
            syncer.restore(backup)
          } else if (workspace.currentRevision === 0 && legacy !== null && legacy !== (question.codeDrafts[0]?.code ?? '')) {
            // Code written before drafts were kept on the server, still only in this browser.
            syncer.edit({ code: legacy, language })
          }
          return syncer
        })
        if (cancelled) return syncers.forEach((syncer) => syncer.dispose())

        syncersRef.current = syncers
        const byQuestion = new Map(syncers.map((syncer) => [syncer.questionId, syncer]))
        const flushAll = async () => {
          const results = await Promise.allSettled(syncers.map((syncer) => syncer.flush()))
          return syncers.filter((_, index) => results[index].status === 'rejected')
        }
        setState({ status: 'ready', syncers: byQuestion, flushAll })
      } catch (error) {
        if (cancelled) return
        if (error instanceof ClosedError) setState({ status: 'closed', recheck: retry })
        else setState({ status: 'error', error, retry })
      }
    }

    const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined
    if (!locks) {
      void bootstrap()
    } else {
      const name = `correcta:workspace-editor:${assessmentId}`
      const hold = () =>
        new Promise<void>((resolve) => {
          release = resolve
        })
      void locks.request(name, { ifAvailable: true }, async (lock) => {
        if (cancelled) return
        if (lock) {
          void bootstrap()
          return hold()
        }
        setState({ status: 'elsewhere' })
        // Queue behind the other tab; when it closes, this one reads the latest drafts and takes over.
        void locks.request(name, async () => {
          if (cancelled) return
          void bootstrap()
          return hold()
        })
      })
    }

    return () => {
      cancelled = true
      for (const syncer of syncersRef.current) {
        void syncer.flush().catch(() => {})
        syncer.dispose()
      }
      syncersRef.current = []
      release?.()
    }
  }, [assessmentId, sessionId, attempt, retry])

  // Leaving or hiding the page saves at once; `keepalive` lets the PUT outlive the page.
  useEffect(() => {
    const flushAll = () => {
      for (const syncer of syncersRef.current) void syncer.flush({ keepalive: true }).catch(() => {})
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushAll()
    }
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!syncersRef.current.some((syncer) => syncer.hasUnsaved())) return
      flushAll()
      event.preventDefault()
    }
    const onOnline = () => {
      for (const syncer of syncersRef.current) void syncer.retry().catch(() => {})
    }
    const id = window.setInterval(onOnline, BACKGROUND_RETRY_MS)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flushAll)
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('online', onOnline)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flushAll)
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  return state
}

const IDLE: SyncSnapshot = {
  state: 'idle',
  revision: 0,
  submittedRevision: null,
  remote: null,
  busy: false,
  error: null,
  tooLong: false,
  run: { status: 'idle' },
}

const noop = () => () => {}

/** Re-renders whenever the syncer's state changes. */
export function useSyncState(syncer: DraftSyncer | undefined): SyncSnapshot {
  return useSyncExternalStore(syncer?.subscribe ?? noop, syncer?.snapshot ?? (() => IDLE))
}
