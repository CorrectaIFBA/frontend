import { Link, type LinkProps } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export type ReviewBackLinkProps = Pick<LinkProps, 'to' | 'params'> & { label: string }

/** The way out of the review, styled like the coding page's. */
export function ReviewBackLink({ label, to, params }: ReviewBackLinkProps) {
  return (
    <Link
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground"
      params={params}
      to={to}
    >
      <ArrowLeft className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}
