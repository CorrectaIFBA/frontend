import type { ProfileType } from '@/shared/api/identity'

export const PROFILE_TYPES: ProfileType[] = ['STUDENT', 'FACULTY', 'STAFF']

export const RING: Record<ProfileType, string> = {
  STUDENT: 'ring-profile-student/45',
  FACULTY: 'ring-profile-faculty/45',
  STAFF: 'ring-profile-staff/45',
}
