import { createFileRoute } from '@tanstack/react-router'
import { PROFILE_STATES, StudentsListPage } from '@/pages/profile-list'
import { PROFILE_SORT_FIELDS } from '@/shared/api/directory'
import { parseListSearch, pickEnum } from '@/shared/lib/list-search'

export const Route = createFileRoute('/_app/students/')({
  head: () => ({ meta: [{ title: 'Estudantes · Correcta' }] }),
  validateSearch: (raw: Record<string, unknown>) => ({
    ...parseListSearch(raw, PROFILE_SORT_FIELDS),
    state: pickEnum(raw.state, PROFILE_STATES),
  }),
  component: StudentsListPage,
})
