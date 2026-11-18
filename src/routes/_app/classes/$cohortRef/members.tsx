import { createFileRoute } from '@tanstack/react-router'
import { MembersTab } from '@/pages/cohort-members'
import { parseListSearch } from '@/shared/lib/list-search'

export const Route = createFileRoute('/_app/classes/$cohortRef/members')({
  validateSearch: (raw: Record<string, unknown>) => parseListSearch(raw, ['joinedAt']),
  component: MembersTab,
})
