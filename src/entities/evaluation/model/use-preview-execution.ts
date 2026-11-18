import { useCallback, useSyncExternalStore } from 'react'
import { openPreviewSocket, type PreviewExecution, type PreviewSocketMessage } from '@/shared/api/evaluations'
import { backoff } from '@/shared/api/workspaces'

/** Idle proxies close quiet sockets; a ping now and then keeps this one open. */
const PING_MS = 25_000

export type PreviewConnection = 'connecting' | 'open' | 'reconnecting'

export type PreviewState = {
  /** The newest run of the workspace the orchestrator still keeps; `null` when there is none. */
  execution: PreviewExecution | null
  connection: PreviewConnection
}

const INITIAL: PreviewState = { execution: null, connection: 'connecting' }

/*
  One socket per workspace, shared by every component that follows it (the
  run button and the test cases). It opens with the first subscriber, closes
  with the last, and reconnects with backoff whenever it drops; every frame is
  a full snapshot, so nothing is lost while it was away.
*/
class PreviewChannel {
  state: PreviewState = INITIAL
  private listeners = new Set<() => void>()
  private socket: WebSocket | undefined
  private retryTimer: number | undefined
  private pingTimer: number | undefined
  private attempt = 0
  private closed = false

  private readonly workspaceId: string

  constructor(workspaceId: string) {
    this.workspaceId = workspaceId
    void this.connect()
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return this.listeners.size
  }

  unsubscribe(listener: () => void) {
    this.listeners.delete(listener)
    return this.listeners.size
  }

  close() {
    this.closed = true
    window.clearTimeout(this.retryTimer)
    window.clearInterval(this.pingTimer)
    this.socket?.close()
  }

  private set(next: PreviewState) {
    this.state = next
    for (const listener of this.listeners) listener()
  }

  /*
    Frames of one run only move forward. A frame of another run replaces the
    current one only if it is newer, so a late frame never shows an old state.
  */
  private accept(incoming: PreviewExecution | null) {
    const current = this.state.execution
    if (incoming && current) {
      if (incoming.id === current.id && incoming.version < current.version) return
      if (incoming.id !== current.id && Date.parse(incoming.createdAt) < Date.parse(current.createdAt)) return
    }
    this.set({ execution: incoming ?? current, connection: 'open' })
  }

  private scheduleReconnect = () => {
    window.clearInterval(this.pingTimer)
    if (this.closed) return
    this.set({ ...this.state, connection: 'reconnecting' })
    this.retryTimer = window.setTimeout(() => void this.connect(), backoff(this.attempt++))
  }

  private async connect() {
    let socket: WebSocket | null
    try {
      socket = await openPreviewSocket(this.workspaceId, () => this.closed)
    } catch {
      return this.scheduleReconnect()
    }
    if (!socket) return
    this.socket = socket

    socket.addEventListener('open', () => {
      this.attempt = 0
      this.set({ ...this.state, connection: 'open' })
      this.pingTimer = window.setInterval(() => socket.readyState === WebSocket.OPEN && socket.send('ping'), PING_MS)
    })
    socket.addEventListener('message', (event) => {
      if (typeof event.data !== 'string' || event.data === 'pong') return
      try {
        const message = JSON.parse(event.data) as PreviewSocketMessage
        if (message.type === 'PREVIEW_EXECUTION') this.accept(message.execution)
      } catch {
        // Not a frame of this protocol; nothing to show.
      }
    })
    socket.addEventListener('close', this.scheduleReconnect)
  }
}

const channels = new Map<string, PreviewChannel>()

/** Channels whose last subscriber left, waiting to close. */
const closing = new Map<string, number>()

/*
  The last subscriber leaving does not close the socket at once: a remount
  (StrictMode, switching tabs of the page) subscribes again within moments
  and keeps the same socket instead of opening a new one.
*/
const CLOSE_GRACE_MS = 2000

function subscribe(workspaceId: string, listener: () => void) {
  const pending = closing.get(workspaceId)
  if (pending !== undefined) {
    window.clearTimeout(pending)
    closing.delete(workspaceId)
  }

  let channel = channels.get(workspaceId)
  if (!channel) {
    channel = new PreviewChannel(workspaceId)
    channels.set(workspaceId, channel)
  }
  channel.subscribe(listener)

  return () => {
    const current = channels.get(workspaceId)
    if (!current || current.unsubscribe(listener) > 0) return
    closing.set(
      workspaceId,
      window.setTimeout(() => {
        closing.delete(workspaceId)
        current.close()
        channels.delete(workspaceId)
      }, CLOSE_GRACE_MS)
    )
  }
}

const noop = () => () => {}

const initial = () => INITIAL

/** Follows the runs of one workspace live. */
export function usePreviewExecution(workspaceId: string | undefined): PreviewState {
  // Both must stay the same between renders: a new subscribe makes React unsubscribe and subscribe again.
  const subscribeToWorkspace = useCallback(
    (listener: () => void) => (workspaceId ? subscribe(workspaceId, listener) : noop()),
    [workspaceId]
  )
  const snapshot = useCallback(
    () => (workspaceId ? (channels.get(workspaceId)?.state ?? INITIAL) : INITIAL),
    [workspaceId]
  )
  return useSyncExternalStore(subscribeToWorkspace, workspaceId ? snapshot : initial)
}
