import { getRouteApi } from "@tanstack/react-router";
import { PROFILE_KINDS } from '@/entities/profile'
import { ProfileListPage } from '@/pages/profile-list/ui/profile-list-page'

const route = getRouteApi('/_app/faculty/')

export function FacultyListPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <ProfileListPage
      kind={PROFILE_KINDS.FACULTY}
      onSearch={(next) => navigate({ search: (previous) => ({ ...previous, ...next }) })}
      search={search}
    />
  )
}
