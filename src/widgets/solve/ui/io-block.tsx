export function IoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/40 px-2 py-1.5 font-mono text-[12px] leading-5 [overflow-wrap:anywhere]">
        {value || <span className="text-muted-foreground">(vazia)</span>}
      </pre>
    </div>
  )
}
