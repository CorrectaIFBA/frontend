import type { ReactNode } from 'react'

/** Label/value rows, the label in a fixed column so values line up down the panel. */
export function FactList({ facts }: { facts: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border/70 px-4">
      {facts.map((fact) => (
        <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4" key={fact.label}>
          <dt className="text-muted-foreground text-xs sm:pt-px">{fact.label}</dt>
          <dd className="min-w-0 truncate text-[13px]">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
