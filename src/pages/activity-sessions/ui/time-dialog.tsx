import { useMutation } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { FormAlert } from '@/shared/ui/form-alert'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function TimeDialog({
  trigger,
  title,
  description,
  confirmLabel,
  successMessage,
  defaultMinutes,
  action,
}: {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel: string
  successMessage: string
  defaultMinutes: number
  action: (change: { extraMinutes: number; reason?: string }) => Promise<unknown>
}) {
  const [open, setOpen] = useState(false)
  const [minutes, setMinutes] = useState(String(defaultMinutes))
  const [reason, setReason] = useState('')
  const valid = /^\d+$/.test(minutes) && Number(minutes) >= 1
  const mutation = useMutation({
    mutationFn: () => action({ extraMinutes: Number(minutes), reason: reason.trim() || undefined }),
    onSuccess: () => {
      setOpen(false)
      toast.success(successMessage)
    },
  })

  return (
    <>
      <span className="contents" onClickCapture={() => setOpen(true)}>
        {trigger}
      </span>
      <Dialog
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            mutation.reset()
            setMinutes(String(defaultMinutes))
            setReason('')
          }
        }}
        open={open}
      >
        <DialogContent className="gap-4 sm:max-w-md">
          <div className="flex flex-col gap-1.5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (valid) mutation.mutate()
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="extra-minutes">Minutos</Label>
              <Input
                aria-invalid={!valid}
                className="w-28"
                id="extra-minutes"
                inputMode="numeric"
                onChange={(event) => setMinutes(event.target.value)}
                value={minutes}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Input
                id="reason"
                maxLength={500}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Ex.: queda de energia no laboratório"
                value={reason}
              />
            </div>
            <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpen(false)} type="button" variant="outline">
                Cancelar
              </Button>
              <Button disabled={!valid || mutation.isPending} type="submit">
                {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
                {confirmLabel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
