import type { ReactNode } from 'react'

export function PageTitle({
  eyebrow,
  leading,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode
  /** A mark beside the heading: an icon tile or an avatar. */
  leading?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {leading}
        <div className="flex min-w-0 flex-col gap-1.5">
          {eyebrow ? <span className="label-xs text-muted-foreground">{eyebrow}</span> : null}
          <h1 className="font-semibold text-[22px] tracking-[-0.03em]">{title}</h1>
          {description ? (
            <div className="max-w-prose text-muted-foreground text-sm">{description}</div>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
