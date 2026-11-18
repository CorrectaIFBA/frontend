import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'

/**
 * Title, description and body of a form dialog, laid out the same everywhere:
 * a header, a scrolling body, and the actions pinned in a footer band.
 */
export function FormDialog({
  trigger,
  icon: Icon,
  title,
  description,
  open,
  onOpenChange,
  children,
  className,
}: {
  trigger: ReactNode
  icon?: LucideIcon
  title: string
  description: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  /** Widens the dialog for richer forms. */
  className?: string
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn('flex max-h-[calc(100svh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg', className)}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex items-start gap-3.5 border-border border-b px-6 pt-5 pb-4">
          {Icon ? (
            <span className="control-raised flex size-9 shrink-0 items-center justify-center rounded-lg border text-muted-foreground">
              <Icon className="size-4" />
            </span>
          ) : null}
          <div className="flex min-w-0 flex-col gap-1 pr-6">
            <DialogTitle className="font-semibold text-[15px] tracking-[-0.01em]">{title}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-5">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
