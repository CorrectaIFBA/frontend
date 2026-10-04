import { cn } from '@/lib/utils'

/** The mark: a check that ends in a cursor — an answer, accepted. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn('size-7 shrink-0', className)}
      fill="none"
      viewBox="0 0 32 32"
    >
      <rect className="fill-primary" height="32" rx="8" width="32" />
      <path
        className="stroke-primary-foreground"
        d="M9 16.5l4.5 4.5L23 11.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        className="caret-blink stroke-primary-foreground/60"
        d="M19 22.5h5"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-semibold text-[17px] tracking-[-0.03em]">correcta</span>
    </span>
  )
}
