import { Link, useMatchRoute } from '@tanstack/react-router'
import { ClipboardList, Settings2, UsersRound } from 'lucide-react'
import type { CohortView } from '@/entities/cohort'
import { CohortStatus, CohortTile } from '@/entities/cohort'
import { cohortAddress } from '@/shared/api/cohorts'
import { dateFormat } from '@/shared/lib/date-format'

/*
  The cover band runs across the top, and the monogram tile sits half on it,
  half on the card — the cohort's identity first, then its name.
*/
export function CohortHeader({ view }: { view: CohortView }) {
  const { cohort, isFaculty } = view
  const params = { cohortRef: cohortAddress(cohort) }
  // An open activity still belongs to the Atividades tab, whose own match is exact.
  const matchRoute = useMatchRoute()
  const inActivity = Boolean(matchRoute({ to: '/classes/$cohortRef/activities/$assessmentSlug', fuzzy: true }))

  const tabs = [
    { to: '/classes/$cohortRef', label: 'Atividades', icon: ClipboardList, exact: true },
    { to: '/classes/$cohortRef/members', label: 'Membros', icon: UsersRound, exact: false },
    ...(isFaculty
      ? [{ to: '/classes/$cohortRef/manage', label: 'Gerenciar', icon: Settings2, exact: false }]
      : []),
  ] as const

  return (
    <header className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="cohort-cover h-20 sm:h-24" />
      <div className="flex flex-col gap-3 px-5 pb-4 sm:flex-row sm:items-end sm:gap-5">
        <CohortTile
          className="-mt-9 size-18 rounded-xl text-[26px] ring-4 ring-card sm:-mt-10"
          cohort={cohort}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:pt-3">
          <h1 className="font-semibold text-[22px] leading-tight tracking-[-0.03em]">{cohort.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted-foreground text-xs">
            <CohortStatus state={cohort.status} />
            <span className="font-mono">/{cohort.slug}</span>
            <span>Criada em {dateFormat.format(new Date(cohort.createdAt))}</span>
          </div>
        </div>
      </div>
      {cohort.description ? (
        <p className="max-w-prose whitespace-pre-line px-5 pb-4 text-muted-foreground text-sm leading-relaxed">
          {cohort.description}
        </p>
      ) : null}
      <nav aria-label="Seções da turma" className="flex gap-1 overflow-x-auto border-border border-t px-3">
        {tabs.map((tab, index) => (
          <Link
            activeOptions={{ exact: tab.exact, includeSearch: false }}
            data-status={index === 0 && inActivity ? 'active' : undefined}
            className="relative inline-flex h-11 shrink-0 items-center gap-2 px-2.5 text-muted-foreground text-sm transition-colors hover:text-foreground data-[status=active]:font-medium data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-2 data-[status=active]:after:bottom-0 data-[status=active]:after:h-0.5 data-[status=active]:after:rounded-full data-[status=active]:after:bg-(--cohort-ink) [&[data-status=active]>svg]:text-(--cohort-ink)"
            key={tab.to}
            params={params}
            to={tab.to}
          >
            <tab.icon className="size-4" strokeWidth={1.75} />
            {tab.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
