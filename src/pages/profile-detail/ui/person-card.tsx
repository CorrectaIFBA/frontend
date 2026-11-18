import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { PersonStatus } from '@/entities/person'
import { PROFILE_KINDS, AccountAvatar, ProfileStateStatus, ProfileTypeTag } from '@/entities/profile'
import type { DetailedPerson } from '@/shared/api/directory'
import { formatCpf } from '@/shared/lib/cpf'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { Skeleton } from '@/shared/ui/skeleton'

/** Who owns the profile, and the other profiles they hold. */
export function PersonCard({ person, profileId }: { person?: DetailedPerson; profileId: string }) {
  if (!person) {
    return (
      <Panel>
        <div className="flex flex-col gap-3 p-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Panel>
    )
  }

  const others = person.institutionalProfiles.filter((profile) => profile.id !== profileId)

  return (
    <Panel>
      <PanelHeading title="Pessoa" />
      <Link
        className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent/45"
        params={{ personId: person.id }}
        to="/persons/$personId"
      >
        <AccountAvatar className="size-9" name={person.displayName} />
        <span className="grid min-w-0 flex-1 gap-0.5 leading-tight">
          <span className="truncate font-medium">{person.displayName}</span>
          <span className="font-mono text-muted-foreground text-xs">{formatCpf(person.documentNumber)}</span>
        </span>
        <PersonStatus active={person.active} />
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>

      <div className="border-border/70 border-t px-4 pt-3 pb-4">
        <p className="mb-2 text-muted-foreground text-xs">
          {others.length === 0 ? 'Nenhum outro perfil.' : 'Outros perfis desta pessoa'}
        </p>
        {others.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {others.map((other) => {
              const otherKind = PROFILE_KINDS[other.type]
              return (
                <li key={other.id}>
                  <Link
                    className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/60"
                    params={{ profileId: other.id }}
                    to={`${otherKind.url}/$profileId`}
                  >
                    <ProfileTypeTag label={otherKind.singular} type={other.type} />
                    <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground text-xs">
                      {other.credentials.login}
                    </span>
                    <ProfileStateStatus state={other.state} />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </Panel>
  )
}
