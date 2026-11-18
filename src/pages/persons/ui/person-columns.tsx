import { IdentityCell } from '@/entities/profile'
import { PersonProfiles } from '@/pages/persons/ui/person-profiles'
import type { Person } from '@/shared/api/directory'
import { formatCpf } from '@/shared/lib/cpf'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import type { Column } from '@/shared/ui/data-table-column'
import { IdentitySkeleton } from '@/shared/ui/identity-skeleton'
import { Skeleton } from '@/shared/ui/skeleton'

export const columns: Column<Person>[] = [
  {
    id: 'name',
    header: 'Nome',
    sortKey: 'legalName',
    cell: (person) => <IdentityCell name={person.displayName} />,
    skeleton: <IdentitySkeleton />,
  },
  {
    id: 'document',
    header: 'CPF',
    sortKey: 'documentNumber',
    className: 'w-40',
    cell: (person) => (
      <span className="font-mono text-muted-foreground text-xs">{formatCpf(person.documentNumber)}</span>
    ),
  },
  {
    id: 'profiles',
    header: 'Perfis',
    hideBelow: 'md',
    cell: (person) => <PersonProfiles personId={person.id} />,
    skeleton: <Skeleton className="h-5 w-20 rounded-sm" />,
  },
  {
    id: 'createdAt',
    header: 'Cadastro',
    sortKey: 'createdAt',
    hideBelow: 'sm',
    className: 'w-32 whitespace-nowrap',
    cell: (person) => (
      <time
        className="text-muted-foreground text-xs tabular-nums"
        dateTime={person.createdAt}
        title={dateTimeFormat.format(new Date(person.createdAt))}
      >
        {relativeDate(person.createdAt)}
      </time>
    ),
  },
]
