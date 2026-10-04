import { Hammer } from 'lucide-react'
import { PageContent, PageTitle, Panel } from '@/components/shell/page'
import { pageByUrl } from '@/components/shell/nav-items'

/**
 * Pages that exist in the navigation but not yet in the backend. They say so
 * plainly instead of showing invented numbers or empty tables.
 */
export function PlaceholderPage({ url }: { url: string }) {
  const page = pageByUrl(url)
  if (!page) return null

  return (
    <PageContent>
      <PageTitle description={page.description} eyebrow={page.group} title={page.title} />

      <Panel className="paper-grid border-dashed bg-transparent">
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
            <page.icon className="size-4.5" strokeWidth={1.75} />
          </span>
          <p className="font-medium text-[13px]">Esta área ainda está sendo construída</p>
          <p className="max-w-sm text-muted-foreground text-xs leading-relaxed">
            Assim que o serviço correspondente estiver disponível, {page.title.toLowerCase()} aparecerão
            aqui.
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/70">
            <Hammer className="size-3" /> em desenvolvimento
          </span>
        </div>
      </Panel>
    </PageContent>
  )
}
