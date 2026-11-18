import { getRouteApi } from "@tanstack/react-router";
import { PROFILE_KINDS } from '@/entities/profile'
import { ProfileDetailPage } from '@/pages/profile-detail/ui/profile-detail-page'

const route = getRouteApi('/_app/staff/$profileId')

export function StaffDetailPage() {
  const { profileId } = route.useParams()
  return <ProfileDetailPage kind={PROFILE_KINDS.STAFF} profileId={profileId} />
}
