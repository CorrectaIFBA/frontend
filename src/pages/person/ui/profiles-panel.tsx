import { Link } from '@tanstack/react-router'
import { ChevronRight, Plus } from 'lucide-react'
import { PROFILE_KINDS, KindMark, ProfileStateStatus, PROFILE_ORDER } from '@/entities/profile'
import { CreateProfileDialog } from '@/features/create-profile'
import type { DetailedPerson } from '@/shared/api/directory'
import { relativeDate } from '@/shared/lib/date-format'
import { Button } from '@/shared/ui/button'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

/*
  One slot per profile type, filled or not, so what a person is missing is as
  plain as what they have.
*/
export function ProfilesPanel({ person }: { person: DetailedPerson }) {
  const profiles = person.institutionalProfiles
  const missing = PROFILE_ORDER.filter((type) => !profiles.some((profile) => profile.type === type))
  const ordered = [...profiles].sort(
    (first, second) => PROFILE_ORDER.indexOf(first.type) - PROFILE_ORDER.indexOf(second.type)
  )

  return (
    <Panel>
      <PanelHeading
        action={
          <span className="text-muted-foreground text-xs tabular-nums">
            {profiles.length} de {PROFILE_ORDER.length}
          </span>
        }
        title="Perfis institucionais"
      />
      <ul className="flex flex-col gap-2 p-3">
        {ordered.map((profile) => {
          const kind = PROFILE_KINDS[profile.type]
          return (
            <li key={profile.id}>
              <Link
                className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-border-strong hover:bg-accent/45"
                params={{ profileId: profile.id }}
                to={`${kind.url}/$profileId`}
              >
                <KindMark className="size-9 [&_svg]:size-4" icon={kind.icon} type={profile.type} />
                <span className="grid min-w-0 flex-1 gap-1">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{kind.singular}</span>
                    <ProfileStateStatus state={profile.state} />
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    <span className="font-mono">{profile.credentials.login}</span>
                    <span className="mx-1.5 text-border-strong">/</span>
                    {profile.email}
                  </span>
                </span>
                <span className="hidden shrink-0 text-muted-foreground text-xs sm:inline">
                  {relativeDate(profile.createdAt)}
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </li>
          )
        })}

        {missing.map((type) => {
          const kind = PROFILE_KINDS[type]
          return (
            <li
              className="flex items-center gap-3 rounded-lg border border-border border-dashed p-3"
              key={type}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60">
                <kind.icon className="size-4" strokeWidth={1.75} />
              </span>
              <span className="flex-1 text-muted-foreground text-xs">
                Sem perfil de {kind.singular.toLowerCase()}
              </span>
              {person.active ? (
                <CreateProfileDialog
                  defaultType={type}
                  person={person}
                  trigger={
                    <Button size="xs" variant="ghost-muted">
                      <Plus /> Adicionar
                    </Button>
                  }
                />
              ) : null}
            </li>
          )
        })}
      </ul>
      {!person.active && missing.length > 0 ? (
        <p className="border-border/70 border-t px-4 py-3 text-muted-foreground text-xs">
          Reative a pessoa para adicionar perfis.
        </p>
      ) : null}
    </Panel>
  )
}
