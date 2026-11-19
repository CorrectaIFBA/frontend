import type { ReactNode } from 'react'

export function SettingsSection({
  id,
  title,
  aside,
  children,
}: {
  id?: string
  title: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="scroll-mt-6 border-border border-b pb-8 not-first:pt-8 last:border-b-0" id={id}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-lg tracking-[-0.025em]">{title}</h2>
        {aside}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  )
}
