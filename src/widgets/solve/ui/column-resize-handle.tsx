import { useRef } from 'react'
import { MIN_TESTCASES_WIDTH } from '@/widgets/solve/config/workspace-layout'

/** The left border of the test cases column, dragged to resize it. Desktop only. */
export function ColumnResizeHandle({
  width,
  onResize,
  onResizeStart,
  onResizeEnd,
}: {
  width: number
  onResize: (width: number) => void
  onResizeStart: () => void
  onResizeEnd: (width: number) => void
}) {
  const start = useRef<{ x: number; width: number } | null>(null)
  const latest = useRef(width)
  const clamp = (value: number) => Math.min(window.innerWidth * 0.6, Math.max(MIN_TESTCASES_WIDTH, value))
  const resize = (value: number) => {
    latest.current = clamp(value)
    onResize(latest.current)
  }

  return (
    <div
      aria-label="Redimensionar casos de teste"
      aria-orientation="vertical"
      aria-valuemin={MIN_TESTCASES_WIDTH}
      aria-valuenow={width}
      className="-mr-1 relative z-10 hidden w-2 shrink-0 cursor-col-resize md:block [&:hover>span]:bg-border-strong"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') resize(width + 24)
        if (event.key === 'ArrowRight') resize(width - 24)
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') onResizeEnd(latest.current)
      }}
      onPointerDown={(event) => {
        start.current = { x: event.clientX, width }
        event.currentTarget.setPointerCapture(event.pointerId)
        onResizeStart()
      }}
      onPointerMove={(event) => {
        // Dragging left widens: the column grows towards the editor.
        if (start.current) resize(start.current.width - (event.clientX - start.current.x))
      }}
      onPointerUp={() => {
        if (!start.current) return
        start.current = null
        onResizeEnd(latest.current)
      }}
      role="separator"
      tabIndex={0}
    >
      <span className="absolute inset-y-0 left-1/2 w-px bg-transparent transition-colors" />
    </div>
  )
}
