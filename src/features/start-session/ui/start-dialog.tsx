import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { LoaderCircle, Play, Timer } from 'lucide-react'
import { useState } from 'react'
import { formatMinutes } from '@/entities/assessment'
import { useCohortView } from '@/entities/cohort'
import type { Assessment } from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { startSession } from '@/shared/api/sessions'
import { Button } from '@/shared/ui/button'
import { ConfirmNotice } from '@/shared/ui/confirm-notice'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { FormAlert } from '@/shared/ui/form-alert'

/** The rules that change how the student must take it, said once more right before the clock starts. */
export function StartDialog({ assessment, compact }: { assessment: Assessment; compact?: boolean }) {
  const { cohort } = useCohortView()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const parameters = assessment.parameters
  const mutation = useMutation({
    mutationFn: () => startSession(assessment.id),
    onSuccess: () =>
      navigate({
        to: '/classes/$cohortRef/activities/$assessmentSlug/solve',
        params: { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug },
      }),
  })

  const points: { icon: typeof Timer; text: string }[] = []
  if (parameters?.maximumTimeAllowed) {
    points.push({
      icon: Timer,
      text: `Você terá ${formatMinutes(parameters.maximumTimeAllowed)} a partir de agora. O tempo não para se você sair da página.`,
    })
  }

  return (
    <>
      {compact ? (
        // Above the row's stretched link, so it opens the dialog instead of the activity page.
        <Button className="relative z-10" onClick={() => setOpen(true)} size="xs">
          <Play /> Iniciar
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Play /> Iniciar atividade
        </Button>
      )}
      <Dialog
        onOpenChange={(next) => {
          if (mutation.isPending) return
          setOpen(next)
          if (!next) mutation.reset()
        }}
        open={open}
      >
        <DialogContent className="gap-4 sm:max-w-md">
          <div className="flex flex-col gap-1.5">
            <DialogTitle>Iniciar {assessment.title}?</DialogTitle>
            <DialogDescription>
              Você tem uma única tentativa.
            </DialogDescription>
          </div>
          <ConfirmNotice message="Iniciar não pode ser desfeito. Depois de iniciar, só um docente pode dar outra chance." tone="irreversible" />
          {points.length ? (
            <ul className="flex flex-col gap-2.5 rounded-md border border-border bg-muted/40 p-3">
              {points.map((point) => (
                <li className="flex gap-2.5 text-xs leading-relaxed" key={point.text}>
                  <point.icon className="mt-0.5 size-3.5 shrink-0 text-(--cohort-ink)" strokeWidth={1.75} />
                  {point.text}
                </li>
              ))}
            </ul>
          ) : null}
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />
          <div className="flex justify-end gap-2">
            <Button disabled={mutation.isPending} onClick={() => setOpen(false)} variant="outline">
              Agora não
            </Button>
            <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending ? <LoaderCircle className="animate-spin" /> : <Play />}
              Iniciar agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
