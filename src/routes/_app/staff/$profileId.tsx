import { createFileRoute } from '@tanstack/react-router'
import { StaffDetailPage } from '@/pages/profile-detail'

export const Route = createFileRoute('/_app/staff/$profileId')({
  head: () => ({ meta: [{ title: 'Servidores · Correcta' }] }),
  component: StaffDetailPage,
})
