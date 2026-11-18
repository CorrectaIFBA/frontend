import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, LoaderCircle, MailPlus, X } from 'lucide-react'
import { useState } from 'react'
import { COHORT_ROLE_LABEL, useCohortView } from '@/entities/cohort'
import { AccountAvatar } from '@/entities/profile'
import type { Validity } from '@/features/manage-cohort/config/invite-options'
import { CandidatePicker } from '@/features/manage-cohort/ui/candidate-picker'
import { type CohortRole, type InvitationCandidate, invitationCandidatesQueryOptions, sendInvitation } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { inDays } from '@/shared/lib/in-days'
import { useDebounced } from '@/shared/lib/use-debounced'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'
import { Segmented } from '@/shared/ui/segmented'

/**
 * Invites one person, found by name, login or e-mail. The role picks which
 * profiles are searched, since a member's role must match their profile.
 */
export function InviteDialog({ onInvited }: { onInvited: (invitee: string) => void }) {
  const { cohort } = useCohortView()
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<CohortRole>('STUDENT')
  const [term, setTerm] = useState('')
  const [selected, setSelected] = useState<InvitationCandidate | null>(null)
  const [validity, setValidity] = useState<Validity>('none')
  const search = useDebounced(term.trim())

  const candidates = useQuery(invitationCandidatesQueryOptions(cohort.id, search, role))

  const mutation = useMutation({
    mutationFn: (candidate: InvitationCandidate) =>
      sendInvitation(cohort.id, {
        profileId: candidate.profileId,
        role: candidate.profileType,
        expiresAt: validity === 'none' ? undefined : inDays(Number(validity)),
      }),
    onSuccess: (invitation) => {
      setOpen(false)
      reset()
      onInvited(invitation.displayName ?? 'o perfil')
    },
  })

  function reset() {
    setTerm('')
    setSelected(null)
    setValidity('none')
    mutation.reset()
  }

  return (
    <FormDialog
      description="Busque por nome, login ou e-mail."
      icon={MailPlus}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
      open={open}
      title="Convidar para a turma"
      trigger={
        <Button size="sm" variant="outline">
          <MailPlus /> Convidar
        </Button>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (selected) mutation.mutate(selected)
        }}
      >
        <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />

        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-sm">Convidar como</span>
          <Segmented<CohortRole>
            label="Papel"
            onChange={(next) => {
              setRole(next)
              setSelected(null)
            }}
            options={[
              { value: 'STUDENT', label: COHORT_ROLE_LABEL.STUDENT },
              { value: 'FACULTY', label: COHORT_ROLE_LABEL.FACULTY },
            ]}
            value={role}
          />
        </div>

        {selected ? (
          <div className="flex items-center gap-3 rounded-md border border-ring/50 bg-primary/6 px-3 py-2.5">
            <AccountAvatar className="size-8" name={selected.displayName} type={selected.profileType} variant="soft" />
            <span className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate font-medium text-[13px]">{selected.displayName}</span>
              <span className="truncate text-muted-foreground text-xs">
                <span className="font-mono">{selected.login}</span> · {selected.email}
              </span>
            </span>
            <Button aria-label="Trocar pessoa" onClick={() => setSelected(null)} size="icon-sm" type="button" variant="ghost-muted">
              <X />
            </Button>
          </div>
        ) : (
          <CandidatePicker
            candidates={candidates}
            onPick={setSelected}
            onTermChange={setTerm}
            role={role}
            search={search}
            term={term}
          />
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-sm">Prazo para aceitar</span>
          <Segmented<Validity>
            label="Prazo para aceitar"
            onChange={setValidity}
            options={[
              { value: 'none', label: 'Sem prazo' },
              { value: '7', label: '7 dias' },
              { value: '30', label: '30 dias' },
            ]}
            value={validity}
          />
        </div>

        <DialogActions>
          <Button onClick={() => setOpen(false)} type="button" variant="outline">
            Cancelar
          </Button>
          <Button disabled={!selected || mutation.isPending} type="submit">
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : <Check />}
            Enviar convite
          </Button>
        </DialogActions>
      </form>
    </FormDialog>
  )
}
