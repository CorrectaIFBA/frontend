import { getRouteApi } from "@tanstack/react-router";
import { PROFILE_KINDS } from '@/entities/profile'
import { ProfileListPage } from '@/pages/profile-list/ui/profile-list-page'

const route = getRouteApi('/_app/students/')

export function StudentsListPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <ProfileListPage
      kind={PROFILE_KINDS.STUDENT}
      onSearch={(next) => navigate({ search: (previous) => ({ ...previous, ...next }) })}
      search={search}
    />
  )
}
