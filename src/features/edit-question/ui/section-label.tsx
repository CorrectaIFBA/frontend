/** Names one of the editors stacked in the code panel. */
export function SectionLabel({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex items-baseline gap-2 border-border border-y bg-muted/60 px-4 py-1.5 first:border-t-0">
      <h3 className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.08em]">{title}</h3>
      <span className="truncate text-muted-foreground/80 text-xs">{hint}</span>
    </div>
  )
}
