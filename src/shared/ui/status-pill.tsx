import { cn } from '@/shared/lib/cn'

/* A tinted chip, so the state reads from across a long list. */
export function StatusPill({ tone, label }: { tone: string; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1.5 whitespace-nowrap rounded-full pr-2 pl-1.5 font-medium text-[11px]',
        tone
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-(--dot)" />
      {label}
    </span>
  )
}
