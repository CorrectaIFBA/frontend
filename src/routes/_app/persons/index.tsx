import { createFileRoute } from '@tanstack/react-router'
import { ACTIVE_FILTERS, PersonsPage } from '@/pages/persons'
import { PERSON_SORT_FIELDS } from '@/shared/api/directory'
import { parseListSearch, pickEnum } from '@/shared/lib/list-search'

export const Route = createFileRoute('/_app/persons/')({
  head: () => ({ meta: [{ title: 'Pessoas · Correcta' }] }),
  validateSearch: (raw: Record<string, unknown>) => ({
    ...parseListSearch(raw, PERSON_SORT_FIELDS),
    status: pickEnum(raw.status, ACTIVE_FILTERS.slice(1)),
  }),
  component: PersonsPage,
})
