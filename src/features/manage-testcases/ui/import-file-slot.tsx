import { FileUp } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type ImportFileSlotProps = {
  label: string
  file?: File
  lineCount?: number
  onPick: (file?: File) => void
}

export function ImportFileSlot({ label, file, lineCount, onPick }: ImportFileSlotProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-medium text-sm">{label}</span>
      <span
        className={cn(
          'flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed px-3 py-2.5 text-center text-xs transition-colors hover:border-border-strong',
          file ? 'border-(--cohort-ink)/50 bg-(--cohort-ink)/5' : 'border-input text-muted-foreground'
        )}
      >
        {file ? (
          <>
            <span className="max-w-full truncate font-medium font-mono">{file.name}</span>
            <span className="text-muted-foreground tabular-nums">
              {lineCount === undefined ? 'lendo…' : `${lineCount} ${lineCount === 1 ? 'linha' : 'linhas'}`}
            </span>
          </>
        ) : (
          <>
            <FileUp className="size-4" />
            Escolher arquivo .txt
          </>
        )}
        <input
          accept=".txt,.in,.out,text/plain"
          className="sr-only"
          onChange={(event) => onPick(event.target.files?.[0])}
          type="file"
        />
      </span>
    </label>
  )
}
