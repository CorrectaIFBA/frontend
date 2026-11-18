import type { ReactNode } from 'react'

export function PanelHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex h-11 items-center justify-between gap-3 border-border border-b px-4">
      <h2 className="font-semibold text-[13px]">{title}</h2>
      {action}
    </div>
  )
}
