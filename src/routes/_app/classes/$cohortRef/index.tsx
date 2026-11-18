import { createFileRoute } from '@tanstack/react-router'
import type { ActivitySearch } from '@/pages/cohort-activities'
import { ActivityTab } from '@/pages/cohort-activities'
import { pickEnum } from '@/shared/lib/list-search'

export const Route = createFileRoute('/_app/classes/$cohortRef/')({
  validateSearch: (raw: Record<string, unknown>): ActivitySearch => {
    const page = Number(raw.page)
    return {
      q: typeof raw.q === 'string' && raw.q.trim() ? raw.q : undefined,
      page: Number.isInteger(page) && page > 1 ? page : undefined,
      state: pickEnum(raw.state, ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const),
      order: raw.order === 'due' ? 'due' : undefined,
    }
  },
  component: ActivityTab,
})
