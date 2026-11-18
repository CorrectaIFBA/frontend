import type { ReactNode } from 'react'

export function SolveScreen({ children }: { children: ReactNode }) {
  return <div className="flex h-svh min-h-0 flex-col bg-background">{children}</div>
}
