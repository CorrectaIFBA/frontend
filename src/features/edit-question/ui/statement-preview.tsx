import { Markdown } from '@/shared/ui/markdown'

export function StatementPreview({ statement }: { statement: string }) {
  if (!statement.trim()) {
    return <p className="min-h-72 text-muted-foreground text-xs">Nada para visualizar ainda.</p>
  }
  return <Markdown className="min-h-72 text-[14px]">{statement}</Markdown>
}
