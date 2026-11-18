import { Link } from '@tanstack/react-router'
import { UserRoundCheck } from 'lucide-react'
import { Notice } from '@/entities/person/ui/lookup-notice'
import type { Person } from '@/shared/api/directory'
import { formatCpf } from '@/shared/lib/cpf'

export function LinkedPerson({ person, hint }: { person: Pick<Person, 'id' | 'displayName' | 'documentNumber'>; hint: string }) {
  return (
    <Notice icon={<UserRoundCheck className="size-4 text-primary" />} tone="primary">
      <span className="grid gap-0.5">
        <span>
          <Link
            className="font-medium hover:underline"
            params={{ personId: person.id }}
            target="_blank"
            to="/persons/$personId"
          >
            {person.displayName}
          </Link>{' '}
          <span className="font-mono text-muted-foreground">{formatCpf(person.documentNumber)}</span>
        </span>
        <span className="text-muted-foreground">{hint}</span>
      </span>
    </Notice>
  )
}
