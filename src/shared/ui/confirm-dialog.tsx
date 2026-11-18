import { useMutation } from '@tanstack/react-query'
import { LoaderCircle, RotateCcw, TriangleAlert } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { errorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { ConfirmNotice, type ConfirmNoticeProps } from '@/shared/ui/confirm-notice'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { FormAlert } from '@/shared/ui/form-alert'

/**
 * Asks before an action that is hard to undo, then runs it and stays open
 * on failure so the reason can be read.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  successMessage,
  destructive,
  notice,
  action,
}: {
  trigger: ReactNode
  title: string
  description?: ReactNode
  confirmLabel: string
  successMessage?: string
  destructive?: boolean
  /** Irreversibility or attention callout shown under the description. */
  notice?: ConfirmNoticeProps
  action: () => Promise<unknown>
}) {
  const [open, setOpen] = useState(false)
  const mutation = useMutation({
    mutationFn: action,
    onSuccess: () => {
      setOpen(false)
      if (successMessage) toast.success(successMessage)
    },
  })

  return (
    <Dialog
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) mutation.reset()
      }}
      open={open}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md" showCloseButton={false}>
        <div className="flex items-start gap-4 px-6 pt-6 pb-5">
          <span
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              destructive ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
            )}
          >
            {destructive ? <TriangleAlert className="size-[18px]" /> : <RotateCcw className="size-[18px]" />}
          </span>
          <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
            <DialogTitle className="font-semibold text-[15px] tracking-[-0.01em]">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
                {description}
              </DialogDescription>
            ) : null}
          </div>
        </div>
        {notice ? (
          <div className="px-6 pb-5">
            <ConfirmNotice {...notice} />
          </div>
        ) : null}
        {mutation.isError ? (
          <div className="px-6 pb-5">
            <FormAlert message={errorMessage(mutation.error)} />
          </div>
        ) : null}
        <div className="flex justify-end gap-2 border-border border-t bg-muted/40 px-6 py-3">
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancelar
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            variant={destructive ? 'destructive' : 'default'}
          >
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
