import { Link, type LinkProps } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export function BackLink({ label, ...link }: LinkProps & { label: string }) {
  return (
    <Link
      className="-ml-1 inline-flex w-fit items-center gap-1 rounded-sm px-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
      {...link}
    >
      <ChevronLeft className="size-3.5" />
      {label}
    </Link>
  )
}
