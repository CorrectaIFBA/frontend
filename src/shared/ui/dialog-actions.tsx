import type { ReactNode } from 'react'

/** The actions at the bottom of a form dialog; stays in view while the body scrolls. */
export function DialogActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-6 mt-2 flex justify-end gap-2 border-border border-t bg-muted/40 px-6 py-3 backdrop-blur-sm">
      {children}
    </div>
  )
}
