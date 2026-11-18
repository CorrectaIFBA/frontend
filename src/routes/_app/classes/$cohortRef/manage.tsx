import { createFileRoute } from '@tanstack/react-router'
import { ManageTab } from '@/pages/cohort-manage'

export const Route = createFileRoute('/_app/classes/$cohortRef/manage')({
  component: ManageTab,
})
