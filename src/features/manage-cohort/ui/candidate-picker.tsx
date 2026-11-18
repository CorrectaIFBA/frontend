import type { UseQueryResult } from '@tanstack/react-query'
import { LoaderCircle, Search } from 'lucide-react'
import { COHORT_ROLE_LABEL } from '@/entities/cohort'
import { AccountAvatar } from '@/entities/profile'
import { CANDIDATE_NOTE } from '@/features/manage-cohort/config/invite-options'
import { PickerHint } from '@/features/manage-cohort/ui/picker-hint'
import type { CohortRole, InvitationCandidate } from '@/shared/api/cohorts'
import { errorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Skeleton } from '@/shared/ui/skeleton'

export function CandidatePicker({
  term,
  search,
  role,
  candidates,
  onTermChange,
  onPick,
}: {
  term: string
  search: string
  role: CohortRole
  candidates: UseQueryResult<InvitationCandidate[]>
  onTermChange: (term: string) => void
  onPick: (candidate: InvitationCandidate) => void
}) {
  const roleLabel = COHORT_ROLE_LABEL[role].toLowerCase()
  let results: React.ReactNode

  if (search.length < 2) {
    results = <PickerHint>Digite pelo menos 2 letras do nome, login ou e-mail.</PickerHint>
  } else if (candidates.isPending) {
    results = Array.from({ length: 3 }, (_, index) => (
      <div className="flex items-center gap-3 px-3 py-2" key={`candidate-skeleton-${index + 1}`}>
        <Skeleton className="size-8 rounded-md" />
        <span className="grid gap-1.5">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-2.5 w-24" />
        </span>
      </div>
    ))
  } else if (candidates.isError) {
    results = <PickerHint>{errorMessage(candidates.error)}</PickerHint>
  } else if (candidates.data.length === 0) {
    results = <PickerHint>{`Nenhum ${roleLabel} ativo encontrado para “${search}”.`}</PickerHint>
  } else {
    results = (
      <ul aria-label="Resultados" className={cn('flex flex-col', candidates.isPlaceholderData && 'opacity-55')}>
        {candidates.data.map((candidate) => {
          const blocked = candidate.status !== 'AVAILABLE'
          return (
            <li key={candidate.profileId}>
              <button
                className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-transparent"
                disabled={blocked}
                onClick={() => onPick(candidate)}
                type="button"
              >
                <AccountAvatar className="size-8" name={candidate.displayName} type={candidate.profileType} variant="soft" />
                <span className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate font-medium text-[13px]">{candidate.displayName}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    <span className="font-mono">{candidate.login}</span> · {candidate.email}
                  </span>
                </span>
                {candidate.status !== 'AVAILABLE' ? (
                  <span className="shrink-0 text-muted-foreground text-xs">{CANDIDATE_NOTE[candidate.status]}</span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-input">
      <label className="flex h-10 items-center gap-2 border-border border-b px-3 text-muted-foreground focus-within:text-foreground">
        <Search className="size-4 shrink-0" />
        <input
          aria-label={`Buscar ${roleLabel}`}
          autoComplete="off"
          autoFocus
          className="h-full w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
          onChange={(event) => onTermChange(event.target.value)}
          placeholder={`Nome, login ou e-mail do ${roleLabel}`}
          spellCheck={false}
          value={term}
        />
        {candidates.isFetching && search.length >= 2 ? <LoaderCircle className="size-3.5 shrink-0 animate-spin" /> : null}
      </label>
      <div className="max-h-64 min-h-24 overflow-y-auto py-1">{results}</div>
    </div>
  )
}
