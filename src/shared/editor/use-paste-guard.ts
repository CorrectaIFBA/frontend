import { type RefObject, useEffect, useRef } from 'react'
import { isCopiedSnippet, rememberSnippet } from '@/shared/editor/copied-snippets'

export type PasteReport = { blocked: boolean; length: number; fromOwnCode: boolean }

export type PasteGuardOptions = {
  blockPaste?: boolean
  onPaste?: (paste: PasteReport) => void
}

/*
  Paste and drop are checked on the way down (capture), before Monaco's
  textarea sees them, so a refused paste never reaches the model. Copy and
  cut are read on the way up, after Monaco has filled the clipboard.
*/
export function usePasteGuard(frame: RefObject<HTMLElement | null>, { blockPaste, onPaste }: PasteGuardOptions) {
  const rules = useRef({ blockPaste, onPaste })

  rules.current = { blockPaste, onPaste }

  useEffect(() => {
    const element = frame.current

    if (!element) return

    const remember = (event: ClipboardEvent) => rememberSnippet(event.clipboardData?.getData('text/plain') ?? '')

    const intercept = (event: ClipboardEvent | DragEvent) => {
      const data = 'clipboardData' in event ? event.clipboardData : event.dataTransfer
      const text = (data?.getData('text/plain') ?? '').replace(/\r\n/g, '\n')

      if (event.type === 'drop' && !text) return

      const fromOwnCode = isCopiedSnippet(text)
      const blocked = Boolean(rules.current.blockPaste) && !fromOwnCode

      if (blocked) {
        event.preventDefault()
        event.stopPropagation()
      }

      rules.current.onPaste?.({ blocked, length: text.length, fromOwnCode })
    }

    element.addEventListener('copy', remember)
    element.addEventListener('cut', remember)
    element.addEventListener('paste', intercept, true)
    element.addEventListener('drop', intercept, true)

    return () => {
      element.removeEventListener('copy', remember)
      element.removeEventListener('cut', remember)
      element.removeEventListener('paste', intercept, true)
      element.removeEventListener('drop', intercept, true)
    }
  }, [frame])
}
