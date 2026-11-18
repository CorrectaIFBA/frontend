/** One line with its trailing spaces shown as dots, so they can be told apart from none. */
export function VisibleLine({ line, className }: { line: string; className?: string }) {
  const trimmed = line.replace(/ +$/, '')
  const trailing = line.length - trimmed.length
  return (
    <span className={className}>
      {trimmed}
      {trailing ? <span className="text-muted-foreground/50">{'·'.repeat(trailing)}</span> : null}
      {line ? null : '\u00a0'}
    </span>
  )
}
