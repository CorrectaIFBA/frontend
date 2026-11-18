import { VisibleLine } from '@/features/manage-testcases/ui/visible-line'

/** One side of a previewed case: its file not chosen yet, no partner line, empty, or the line itself. */
export function PreviewCell({ value, pending }: { value?: string; pending: boolean }) {
  if (pending) {
    return <td className="px-3 py-1 font-sans text-muted-foreground/60 text-xs">aguardando arquivo</td>
  }
  if (value === undefined) {
    return <td className="px-3 py-1 font-sans text-destructive text-xs italic">sem par</td>
  }
  if (!value) {
    return <td className="px-3 py-1 font-sans text-muted-foreground text-xs italic">vazia</td>
  }
  return (
    <td className="max-w-0 px-3 py-1">
      <VisibleLine className="block truncate whitespace-pre" line={value} />
    </td>
  )
}
