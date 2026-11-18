import { FlaskConical } from 'lucide-react'
import { PREVIEW_ROWS } from '@/features/manage-testcases/config/preview-rows'
import { TYPE_INFO } from '@/features/manage-testcases/config/testcase-types'
import { PreviewCell } from '@/features/manage-testcases/ui/preview-cell'
import type { TestcaseType } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'

/*
  The test cases the import would create, paired line by line and numbered
  where they land in the list. Lines without a partner are flagged, since
  the service refuses files of different lengths.
*/
export function ImportPreview({
  inputs,
  outputs,
  existing,
  mismatch,
  type,
}: {
  inputs?: string[]
  outputs?: string[]
  existing: number
  mismatch: boolean
  type: TestcaseType
}) {
  const total = Math.max(inputs?.length ?? 0, outputs?.length ?? 0)
  const shown = Math.min(total, PREVIEW_ROWS)
  const info = TYPE_INFO[type]
  const TypeIcon = info.icon

  return (
    <section
      aria-label="Prévia da importação"
      className="flex min-w-0 flex-col overflow-hidden rounded-md border border-border lg:sticky lg:top-0"
    >
      <div className="flex h-10 items-center gap-3 border-border border-b bg-muted/40 px-3 text-xs">
        <span className="font-medium">Prévia</span>
        {total ? (
          <span className={cn('tabular-nums', mismatch ? 'text-destructive' : 'text-muted-foreground')}>
            {mismatch
              ? `${inputs?.length ?? 0} entradas para ${outputs?.length ?? 0} saídas`
              : `${total} ${total === 1 ? 'caso' : 'casos'}, do ${existing + 1} ao ${existing + total}`}
          </span>
        ) : null}
        <span className="ml-auto flex items-center gap-1 text-muted-foreground" title={info.hint}>
          <TypeIcon className="size-3.5" /> {info.label}
        </span>
      </div>

      {total ? (
        <div className="max-h-[min(60svh,34rem)] overflow-auto">
          <table className="w-full border-collapse font-mono text-[12px] leading-[1.55]">
            <thead className="sticky top-0 bg-card font-sans text-[10.5px] text-muted-foreground">
              <tr className="border-border/70 border-b text-left">
                <th className="w-12 px-3 py-1.5 text-right font-normal">
                  <span className="sr-only">Caso</span>
                </th>
                <th className="px-3 py-1.5 font-normal">Entrada</th>
                <th className="px-3 py-1.5 font-normal">Saída esperada</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: shown }, (_, index) => {
                const input = inputs?.[index]
                const output = outputs?.[index]
                const orphan = mismatch && (input === undefined || output === undefined)
                return (
                  <tr
                    className={cn('border-border/50 border-b align-top last:border-b-0', orphan && 'bg-destructive/8')}
                    key={index}
                  >
                    <td className="px-3 py-1 text-right font-sans font-semibold text-(--cohort-ink) text-xs tabular-nums">
                      {existing + index + 1}
                    </td>
                    <PreviewCell pending={!inputs} value={input} />
                    <PreviewCell pending={!outputs} value={output} />
                  </tr>
                )
              })}
            </tbody>
          </table>
          {total > shown ? (
            <p className="border-border border-t px-3 py-2 text-muted-foreground text-xs">
              Mais {total - shown} {total - shown === 1 ? 'caso' : 'casos'} além dos {shown} mostrados.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
          <FlaskConical className="size-5 text-muted-foreground" />
          <p className="max-w-xs text-muted-foreground text-xs leading-relaxed">
            Escolha os dois arquivos para ver a prévia.
          </p>
        </div>
      )}
    </section>
  )
}
