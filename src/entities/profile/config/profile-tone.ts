import type { ProfileType } from '@/shared/api/identity'

/*
  Class names per profile hue, spelled out in full so Tailwind finds them.
  `solid` marks whose account it is; `soft` tints rows that sit side by side.
*/
export const PROFILE_TONE: Record<
  ProfileType,
  { solid: string; soft: string; text: string; dot: string; ring: string }
> = {
  STUDENT: {
    solid: 'bg-profile-student text-background',
    soft: 'bg-profile-student/14 text-profile-student',
    text: 'text-profile-student',
    dot: 'bg-profile-student',
    ring: 'border-profile-student/45',
  },
  FACULTY: {
    solid: 'bg-profile-faculty text-background',
    soft: 'bg-profile-faculty/14 text-profile-faculty',
    text: 'text-profile-faculty',
    dot: 'bg-profile-faculty',
    ring: 'border-profile-faculty/45',
  },
  STAFF: {
    solid: 'bg-profile-staff text-background',
    soft: 'bg-profile-staff/14 text-profile-staff',
    text: 'text-profile-staff',
    dot: 'bg-profile-staff',
    ring: 'border-profile-staff/45',
  },
}
