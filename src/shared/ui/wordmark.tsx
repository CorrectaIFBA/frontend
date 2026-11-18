import { cn } from '@/shared/lib/cn'
import { LogoMark } from '@/shared/ui/logo-mark'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-semibold text-[17px] tracking-[-0.03em]">correcta</span>
    </span>
  )
}
