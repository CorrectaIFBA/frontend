import type { ReactNode } from 'react'

export function TableNotice({
  icon,
  title,
  hint,
  action,
}: {
  icon: ReactNode
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 border-border/70 border-t px-6 py-14 text-center">
      <span className="mb-1 flex size-10 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground">
        {icon}
      </span>
      <p className="font-medium text-[13px]">{title}</p>
      {hint ? <p className="max-w-sm text-muted-foreground text-xs leading-relaxed">{hint}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
