import { useNavigate } from '@tanstack/react-router'
import { LoaderCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { SubmitRow } from '@/entities/workspace'
import { cohortAddress } from '@/shared/api/cohorts'
import { ApiError, errorMessage } from '@/shared/api/errors'
import { postAssessmentSubmission, submitWithRetry } from '@/shared/api/workspaces'
import { Button } from '@/shared/ui/button'
import { ConfirmNotice } from '@/shared/ui/confirm-notice'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { FormAlert } from '@/shared/ui/form-alert'
import { useSolve } from '@/widgets/solve/model/solve-context'

/*
  Delivering the activity (guide, section 6). Only saved code is submitted,
  so every question is saved first; if any save fails nothing is sent, or
  that question's latest text would be silently left out. Then the workspace
  service submits every question, and the assessment service closes the
  session.
*/
export function SubmitDialog() {
  const { questions, coding, cohort, assessment, syncers, flushAll } = useSolve()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [failed, setFailed] = useState<Set<string>>(new Set())

  const confirm = async () => {
    setPending(true)
    setError(null)
    setFailed(new Set())
    const all = [...syncers.values()]
    all.forEach((syncer) => syncer.setBusy(true))
    try {
      const unsaved = await flushAll()
      if (unsaved.length) {
        setFailed(new Set(unsaved.map((syncer) => syncer.questionId)))
        setError(
          unsaved.length === 1
            ? 'Uma questão não pôde ser salva. Nada foi entregue. Tente de novo.'
            : `${unsaved.length} questões não puderam ser salvas. Nada foi entregue. Tente de novo.`
        )
        return
      }

      try {
        await submitWithRetry(() => postAssessmentSubmission(assessment.id))
      } catch (failure) {
        if (failure instanceof ApiError && failure.status >= 500) {
          // Some questions may have gone through; resending skips them.
          setError('Algumas respostas não foram confirmadas. Tente de novo.')
          return
        }
        throw failure
      }
      all.forEach((syncer) => syncer.markSubmitted())

      // The workspace service closes the session asynchronously; wait for it before leaving.
      const ended = await coding.awaitEnd()
      if (!ended) {
        setError('As respostas foram enviadas, mas a entrega não foi confirmada. Tente de novo em instantes.')
        return
      }
      toast.success('Atividade entregue.')
      navigate({
        to: '/classes/$cohortRef/activities/$assessmentSlug',
        params: { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug },
      })
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      all.forEach((syncer) => syncer.setBusy(false))
      setPending(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Send /> Entregar
      </Button>
      <Dialog onOpenChange={(next) => !pending && setOpen(next)} open={open}>
        <DialogContent className="gap-4 sm:max-w-lg">
          <div className="flex flex-col gap-1.5">
            <DialogTitle>Entregar a atividade?</DialogTitle>
            <DialogDescription>
              Questões sem código contam como não respondidas.
            </DialogDescription>
          </div>
          <ConfirmNotice message="Depois de entregar, só um docente pode reabrir a atividade." tone="irreversible" />
          <ol aria-label="O que será enviado" className="divide-y divide-border/70 rounded-md border border-border px-3 text-xs">
            {questions.map((question, index) => {
              const syncer = syncers.get(question.id)
              return syncer ? (
                <SubmitRow
                  failed={failed.has(question.id)}
                  key={question.id}
                  number={index + 1}
                  syncer={syncer}
                  title={question.title}
                />
              ) : null
            })}
          </ol>
          <FormAlert message={error} />
          <div className="flex justify-end gap-2">
            <Button disabled={pending} onClick={() => setOpen(false)} variant="outline">
              Continuar escrevendo
            </Button>
            <Button disabled={pending} onClick={confirm}>
              {pending ? <LoaderCircle className="animate-spin" /> : <Send />}
              {error ? 'Tentar de novo' : 'Entregar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
