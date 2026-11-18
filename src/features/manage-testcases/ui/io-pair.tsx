import { PREVIEW_LINES, previewLines } from '@/features/manage-testcases/lib/preview-lines'
import { VisibleLine } from '@/features/manage-testcases/ui/visible-line'
import { cn } from '@/shared/lib/cn'

/*
  Input and output as the program sees them, in one box split by a strong
  rule so the two read as a pair. Judges compare whitespace too, so trailing
  spaces show as dots and an empty value says so. When either side has more
  than one line, both get line numbers, so line N of the input can be found
  beside line N of the output. Long lines wrap under their own number.
*/
export function IoPair({ input, output }: { input: string | null; output: string | null }) {
  const sides = [
    { label: 'Entrada', value: input, lines: previewLines(input) },
    { label: 'Saída esperada', value: output, lines: previewLines(output) },
  ]
  const numbered = sides.some((side) => side.value && side.lines.length > 1)

  return (
    <div className="grid min-w-0 overflow-hidden rounded-md border border-border md:grid-cols-2">
      {sides.map((side, index) => {
        const shown = side.lines.slice(0, PREVIEW_LINES)
        const hidden = side.lines.length - shown.length
        return (
          <div
            className={cn(
              'flex min-w-0 flex-col',
              index === 0
                ? 'bg-muted/40'
                : 'border-border-strong border-t-2 bg-(--cohort-ink)/4 md:border-t-0 md:border-l-2'
            )}
            key={side.label}
          >
            <span className="px-2.5 pt-1.5 text-[10.5px] text-muted-foreground md:hidden">{side.label}</span>
            {side.value ? (
              <pre
                className={cn(
                  'grid min-w-0 whitespace-pre-wrap font-mono text-[12px] leading-[1.55] [overflow-wrap:anywhere]',
                  numbered ? 'grid-cols-[auto_minmax(0,1fr)]' : 'grid-cols-[minmax(0,1fr)]',
                  // Room between the column rule and the values.
                  index === 0 ? 'md:mr-3' : 'md:ml-3'
                )}
              >
                {shown.map((line, lineIndex) => {
                  // The first and last lines carry the box's padding, so the number rule runs top to bottom.
                  const edge = cn(lineIndex === 0 && 'pt-1.5', lineIndex === shown.length - 1 && 'pb-2')

                  return [
                    numbered ? (
                      <span
                        aria-hidden
                        className={cn(
                          'select-none border-border/60 border-r pr-1.5 pl-2 text-right text-muted-foreground/50 tabular-nums',
                          edge
                        )}
                        key={`number-${lineIndex}`}
                      >
                        {lineIndex + 1}
                      </span>
                    ) : null,
                    <VisibleLine className={cn('block px-2.5', edge)} key={`line-${lineIndex}`} line={line} />,
                  ]
                })}
              </pre>
            ) : (
              <p className={cn('px-2.5 py-1.5 text-muted-foreground text-xs italic', index === 1 && 'md:ml-3')}>vazia</p>
            )}
            {hidden > 0 ? (
              <span
                className={cn(
                  'mt-auto border-border/60 border-t px-2.5 py-1 text-[11px] text-muted-foreground',
                  index === 1 && 'md:pl-5.5'
                )}
              >
                mais {hidden} {hidden === 1 ? 'linha' : 'linhas'}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
