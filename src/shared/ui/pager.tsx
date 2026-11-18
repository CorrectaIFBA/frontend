import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Paged } from '@/shared/api/directory'
import { cn } from '@/shared/lib/cn'
import { pageWindow } from '@/shared/lib/page-window'
import { Button } from '@/shared/ui/button'

export function Pager<T>({ data, onPage }: { data: Paged<T>; onPage: (page: number) => void }) {
  const first = data.page * data.size + 1
  const last = Math.min(first + data.content.length - 1, data.totalElements)
  const current = data.page + 1
  const total = Math.max(data.totalPages, 1)

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap items-center justify-between gap-3 border-border border-t bg-muted/25 px-5 py-2.5"
    >
      <span className="text-muted-foreground text-xs tabular-nums">
        <span className="font-medium text-foreground">
          {first}–{last}
        </span>{' '}
        de {data.totalElements}
      </span>
      {total > 1 ? (
        <div className="flex items-center gap-1">
          <Button
            aria-label="Página anterior"
            disabled={current <= 1}
            onClick={() => onPage(current - 1)}
            size="icon-sm"
            variant="ghost-muted"
          >
            <ChevronLeft />
          </Button>
          {pageWindow(current, total).map((page, index) =>
            page === 'gap' ? (
              <span className="w-5 text-center text-muted-foreground text-xs" key={`gap-${index + 1}`}>
                …
              </span>
            ) : (
              <button
                aria-current={page === current ? 'page' : undefined}
                className={cn(
                  'h-7 min-w-7 cursor-pointer rounded-md px-1.5 text-xs tabular-nums transition-colors',
                  page === current
                    ? 'control-raised border font-semibold text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                key={page}
                onClick={() => onPage(page)}
                type="button"
              >
                {page}
              </button>
            )
          )}
          <Button
            aria-label="Próxima página"
            disabled={current >= total}
            onClick={() => onPage(current + 1)}
            size="icon-sm"
            variant="ghost-muted"
          >
            <ChevronRight />
          </Button>
        </div>
      ) : null}
    </nav>
  )
}
