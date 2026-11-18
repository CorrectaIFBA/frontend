import { LoaderCircle, Ticket } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { codeFromInput } from '@/entities/cohort'
import { useJoinCohort } from '@/features/join-cohort/model/use-join-cohort'
import { joinWithCode } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'
import { Input } from '@/shared/ui/input'

export function JoinCohortDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const code = codeFromInput(value)
  const mutation = useJoinCohort(
    () => joinWithCode(code),
    () => {
      setOpen(false)
      setValue('')
    }
  )

  return (
    <FormDialog
      description="Use o código ou o link compartilhado pelo docente."
      icon={Ticket}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) mutation.reset()
      }}
      open={open}
      title="Entrar com código"
      trigger={trigger}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (code) mutation.mutate()
        }}
      >
        <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
        <label className="flex flex-col gap-2">
          <span className="font-medium text-sm">Código de convite</span>
          <Input
            autoComplete="off"
            autoFocus
            className="h-10 font-mono tracking-wide"
            onChange={(event) => setValue(event.target.value)}
            placeholder="Cole o código ou o link"
            spellCheck={false}
            value={value}
          />
        </label>
        <DialogActions>
          <Button onClick={() => setOpen(false)} type="button" variant="outline">
            Cancelar
          </Button>
          <Button disabled={mutation.isPending || !code} type="submit">
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            Entrar na turma
          </Button>
        </DialogActions>
      </form>
    </FormDialog>
  )
}
