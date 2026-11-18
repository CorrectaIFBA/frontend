import type { ReactNode } from 'react'

export function FormSection({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-border border-t pt-5">
      <div className="grid gap-0.5">
        <h3 className="font-semibold text-[13px]">{title}</h3>
        <p className="text-muted-foreground text-xs">{hint}</p>
      </div>
      {children}
    </section>
  )
}
