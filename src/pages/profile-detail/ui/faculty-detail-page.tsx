import { getRouteApi } from "@tanstack/react-router";
import { PROFILE_KINDS } from '@/entities/profile'
import { ProfileDetailPage } from '@/pages/profile-detail/ui/profile-detail-page'

const route = getRouteApi('/_app/faculty/$profileId')

export function FacultyDetailPage() {
  const { profileId } = route.useParams()
  return <ProfileDetailPage kind={PROFILE_KINDS.FACULTY} profileId={profileId} />
}
