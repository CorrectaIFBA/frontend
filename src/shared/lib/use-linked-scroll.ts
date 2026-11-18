import { type UIEvent, useCallback, useRef } from 'react'

/*
  Keeps several panes scrolled together, so line N of one stays beside line N
  of the others. A pane moved by another does not echo the move back, or
  panes of different lengths would pull each other to the shortest one's end.

  Spread `linked(index)` on each pane. With `enabled` false the panes scroll
  on their own.
*/
export function useLinkedScroll(enabled = true) {
  const panes = useRef(new Map<number, HTMLElement>())
  const echoes = useRef(new Set<HTMLElement>())
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  return useCallback(
    (index: number) => ({
      ref: (element: HTMLElement | null) => {
        if (element) panes.current.set(index, element)
        else panes.current.delete(index)
      },
      onScroll: (event: UIEvent<HTMLElement>) => {
        const source = event.currentTarget
        if (echoes.current.delete(source) || !enabledRef.current) return
        for (const [other, pane] of panes.current) {
          if (other === index) continue
          const before = [pane.scrollTop, pane.scrollLeft]
          pane.scrollTop = source.scrollTop
          pane.scrollLeft = source.scrollLeft
          // Only a pane that actually moved fires a scroll event to skip.
          if (pane.scrollTop !== before[0] || pane.scrollLeft !== before[1]) echoes.current.add(pane)
        }
      },
    }),
    []
  )
}

export type LinkedPane = ReturnType<ReturnType<typeof useLinkedScroll>>
