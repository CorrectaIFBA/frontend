import { useNavigate } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { useMemo } from 'react'
import { SESSION_STATE_LABEL } from '@/entities/session'
import { cohortAddress } from '@/shared/api/cohorts'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { useSolve } from '@/widgets/solve/model/solve-context'

export function SessionEndDialog() {
  const { coding, cohort, assessment } = useSolve()
  const navigate = useNavigate()
  const { session } = coding
  const ended = session.state !== 'IN_PROGRESS'
  const toActivity = () =>
    navigate({
      to: '/classes/$cohortRef/activities/$assessmentSlug',
      params: { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug },
    })

  const message = useMemo(() => {
    switch (session.state) {
      case 'EXPIRED':
        return 'O tempo da atividade acabou. Vale o que você enviou até o fim do prazo.'
      case 'SUBMITTED':
        return 'A atividade foi entregue. O código não pode mais mudar.'
      default:
        return ''
    }
  }, [session.state])

  if (!ended) return null

  return (
    <Dialog open>
      <DialogContent className="gap-4 sm:max-w-md" showCloseButton={false}>
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CircleAlert className="size-5" />
          </span>
          <div className="flex flex-col gap-1.5">
            <DialogTitle>{SESSION_STATE_LABEL[session.state]}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={toActivity}>Ir para a atividade</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
