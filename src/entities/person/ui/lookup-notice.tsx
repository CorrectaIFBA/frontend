export function Notice({
  icon,
  tone,
  children,
}: {
  icon: React.ReactNode
  tone?: 'primary'
  children: React.ReactNode
}) {
  return (
    <div
      className={
        tone === 'primary'
          ? 'flex items-start gap-2.5 rounded-md border border-primary/30 bg-primary/6 px-3 py-2.5 text-xs'
          : 'flex items-start gap-2.5 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-xs'
      }
    >
      <span className="mt-px shrink-0 text-muted-foreground">{icon}</span>
      {children}
    </div>
  )
}
