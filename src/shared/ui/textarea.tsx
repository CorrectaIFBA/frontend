import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'flex min-h-20 w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-[calc(--spacing(3)-1px)] py-2 text-base leading-relaxed transition-colors md:text-[13px]',
        'placeholder:text-muted-foreground/70 hover:border-border-strong aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  )
}
