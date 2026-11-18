import type { ProfileState } from '@/shared/api/identity'
import type { ListSearch } from '@/shared/lib/list-search'

export type ProfileListSearch = ListSearch & { state?: ProfileState }

export const PROFILE_STATES: ProfileState[] = ['PENDING', 'ACTIVE', 'INACTIVE']
