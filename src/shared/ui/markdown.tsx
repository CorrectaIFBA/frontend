import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/shared/lib/cn'

/*
  Activity instructions are written in Markdown (GitHub flavour). Raw HTML
  is not rendered, only escaped, so instructions cannot inject markup.
  Links sit above the row's stretched link (`relative z-10`), so they stay
  clickable inside a clickable card.
*/
const components: Components = {
  h1: ({ node: _, ...props }) => <h3 className="mt-4 font-semibold text-[15px] tracking-[-0.01em] first:mt-0" {...props} />,
  h2: ({ node: _, ...props }) => <h4 className="mt-4 font-semibold text-[14px] first:mt-0" {...props} />,
  h3: ({ node: _, ...props }) => <h5 className="mt-3 font-semibold text-[13px] first:mt-0" {...props} />,
  h4: ({ node: _, ...props }) => <h6 className="mt-3 font-medium text-[13px] first:mt-0" {...props} />,
  p: ({ node: _, ...props }) => <p className="mt-2 first:mt-0" {...props} />,
  a: ({ node: _, ...props }) => (
    <a
      className="relative z-10 text-(--cohort-ink) underline decoration-current/40 underline-offset-2 hover:decoration-current"
      rel="noreferrer noopener"
      target="_blank"
      {...props}
    />
  ),
  ul: ({ node: _, ...props }) => <ul className="mt-2 list-disc pl-5 first:mt-0 [&_ul]:mt-1" {...props} />,
  ol: ({ node: _, ...props }) => <ol className="mt-2 list-decimal pl-5 first:mt-0 [&_ol]:mt-1" {...props} />,
  li: ({ node: _, ...props }) => <li className="mt-0.5 pl-0.5 marker:text-muted-foreground" {...props} />,
  blockquote: ({ node: _, ...props }) => (
    <blockquote className="mt-2 border-border-strong border-l-2 pl-3 text-muted-foreground first:mt-0" {...props} />
  ),
  hr: () => <hr className="my-3 border-border" />,
  code: ({ node: _, className, ...props }) => (
    <code
      className={cn(
        'rounded-sm bg-muted px-1 py-px font-mono text-[0.9em]',
        // Inside a fenced block the <pre> already draws the box.
        '[pre_&]:bg-transparent [pre_&]:p-0',
        className
      )}
      {...props}
    />
  ),
  pre: ({ node: _, ...props }) => (
    // Long lines wrap instead of scrolling sideways; the breaks the author wrote are kept.
    <pre
      className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-muted/50 p-3 font-mono text-xs leading-relaxed [overflow-wrap:anywhere] first:mt-0"
      {...props}
    />
  ),
  table: ({ node: _, ...props }) => (
    <div className="mt-2 overflow-x-auto first:mt-0">
      <table className="w-full border-collapse text-xs" {...props} />
    </div>
  ),
  th: ({ node: _, ...props }) => <th className="border border-border bg-muted/50 px-2 py-1 text-left font-medium" {...props} />,
  td: ({ node: _, ...props }) => <td className="border border-border px-2 py-1" {...props} />,
  img: ({ node: _, alt, ...props }) => <img alt={alt ?? ''} className="mt-2 max-h-80 rounded-md border border-border" {...props} />,
  input: ({ node: _, ...props }) => <input className="mr-1.5 align-middle" disabled {...props} />,
}

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('min-w-0 break-words leading-relaxed', className)}>
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
