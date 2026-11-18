import { type PointerEvent as ReactPointerEvent, useRef } from 'react'
import { MIN_STATEMENT_WIDTH } from '@/widgets/solve/config/workspace-layout'

/** The border between statement and editor, dragged to resize. Desktop only. */
export function DragHandle({ width, onResize }: { width: number; onResize: (width: number) => void }) {
  const start = useRef<{ x: number; width: number } | null>(null)

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    start.current = { x: event.clientX, width }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current) return
    const max = window.innerWidth * 0.55
    onResize(Math.min(max, Math.max(MIN_STATEMENT_WIDTH, start.current.width + event.clientX - start.current.x)))
  }

  return (
    <div
      aria-label="Redimensionar enunciado"
      aria-orientation="vertical"
      aria-valuemin={MIN_STATEMENT_WIDTH}
      aria-valuenow={width}
      className="-ml-1 relative z-10 hidden w-2 shrink-0 cursor-col-resize md:block [&:hover>span]:bg-border-strong"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') onResize(Math.max(MIN_STATEMENT_WIDTH, width - 24))
        if (event.key === 'ArrowRight') onResize(Math.min(window.innerWidth * 0.55, width + 24))
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => {
        start.current = null
      }}
      role="separator"
      tabIndex={0}
    >
      <span className="absolute inset-y-0 left-1/2 w-px bg-transparent transition-colors" />
    </div>
  )
}
