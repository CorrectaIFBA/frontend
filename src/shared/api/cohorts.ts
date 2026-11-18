import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { type Paged, type Pagination, toQuery } from '@/shared/api/directory'
import { ApiError } from '@/shared/api/errors'
import { COHORT_API_URL, type RawRequest } from '@/shared/api/http'
import type { ProfileType } from '@/shared/api/identity'
import { queryClient } from '@/shared/api/query-client'
import { authedRequest } from '@/shared/api/session'

/*
  Cohorts (turmas) from the cohort service. A profile only ever sees the
  cohorts it owns or is a current member of; the service filters the rest out.
*/

export type CohortState = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'

export type CohortRole = 'STUDENT' | 'FACULTY'

export type InvitationCodeState = 'ACTIVE' | 'EXPIRED' | 'REVOKED'

export type InvitationState = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVOKED' | 'EXPIRED'

export type Cohort = {
  id: string
  ownerProfileId: string
  name: string
  /** Readable part of the address; cohorts may share one. */
  slug: string
  /** Short code that never changes; it alone finds the cohort. */
  publicCode: string
  status: CohortState
  description: string | null
  createdAt: string
}

export type CohortSummary = Pick<Cohort, 'id' | 'name' | 'slug' | 'publicCode' | 'status'>

export type CohortMember = {
  profileId: string
  displayName: string | null
  profileType: ProfileType | null
  role: CohortRole
  joinedAt: string
}

export type CohortMembership = {
  cohortId: string
  profileId: string
  role: CohortRole
  joinedAt: string
}

export type CohortInvitation = {
  id: string
  cohortId: string
  profileId: string
  displayName: string | null
  login: string | null
  email: string | null
  profileType: ProfileType | null
  role: CohortRole
  status: InvitationState
  invitedAt: string
  expiresAt: string | null
}

export type InvitationCandidate = {
  profileId: string
  displayName: string
  login: string | null
  email: string
  profileType: CohortRole
  /** Whether the profile can still be invited to this cohort. */
  status: 'AVAILABLE' | 'MEMBER' | 'INVITED'
}

export type InvitationCode = {
  id: string
  code: string
  state: InvitationCodeState
  createdByProfileId: string
  createdAt: string
  expiresAt: string
  cohort: CohortSummary
}

export type CreatedInvitationCode = {
  code: string
  expiresAt: string
  cohort: CohortSummary
}

/** A pending invitation addressed to the signed-in profile. */
export type MyCohortInvitation = {
  id: string
  cohort: CohortSummary
  role: CohortRole
  invitedByName: string | null
  invitedAt: string
  expiresAt: string | null
}

export type CohortFilter = {
  status?: CohortState
  mine?: boolean
  createdAfter?: string
  createdBefore?: string
  /** Part of the name or address. */
  search?: string
  /** Only cohorts this profile currently belongs to. */
  memberProfileId?: string
}

export type CohortBody = { name: string; slug?: string; description?: string }

export const COHORT_SORT_FIELDS = ['createdAt', 'updatedAt', 'slug'] as const

export const COHORT_STATES: CohortState[] = ['ACTIVE', 'DRAFT', 'ARCHIVED']
/** Same rule as the service: lowercase words joined by single hyphens. */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

function cohortRequest<T>(path: string, options: Omit<RawRequest, 'bearer' | 'baseUrl'> = {}) {
  return authedRequest<T>(path, { ...options, baseUrl: COHORT_API_URL })
}

/* ---------------------------------------------------------------------------
   Queries
--------------------------------------------------------------------------- */

export const cohortKeys = {
  all: ['cohorts'] as const,
  detail: (cohortId: string) => ['cohorts', 'detail', cohortId] as const,
}

export const cohortsQueryOptions = (filter: CohortFilter, pagination: Pagination) =>
  queryOptions({
    queryKey: [...cohortKeys.all, 'list', filter, pagination],
    queryFn: ({ signal }) =>
      cohortRequest<Paged<Cohort>>(`/cohorts${toQuery({ ...filter, ...pagination })}`, { signal }),
    placeholderData: keepPreviousData,
  })

/*
  A cohort's place in URLs is "{slug}-{publicCode}": the slug is there to be
  read and may repeat across cohorts, the code finds the cohort. The code
  never has a hyphen, so it is whatever follows the last one.
*/
export function cohortAddress(cohort: Pick<Cohort, 'slug' | 'publicCode'>) {
  return `${cohort.slug}-${cohort.publicCode}`
}

export function publicCodeOf(address: string) {
  return address.slice(address.lastIndexOf('-') + 1)
}

export const cohortQueryOptions = (publicCode: string) =>
  queryOptions({
    queryKey: [...cohortKeys.all, 'by-code', publicCode],
    queryFn: ({ signal }) => cohortRequest<Cohort>(`/cohorts/by-code/${publicCode}`, { signal }),
  })

export const cohortMembersQueryOptions = (cohortId: string, pagination: Pagination) =>
  queryOptions({
    queryKey: [...cohortKeys.detail(cohortId), 'members', pagination],
    queryFn: ({ signal }) =>
      cohortRequest<Paged<CohortMember>>(`/cohorts/${cohortId}/members${toQuery(pagination)}`, {
        signal,
      }),
    placeholderData: keepPreviousData,
  })

export const cohortFacultyQueryOptions = (cohortId: string) =>
  queryOptions({
    queryKey: [...cohortKeys.detail(cohortId), 'faculty'],
    queryFn: ({ signal }) =>
      cohortRequest<Paged<CohortMember>>(`/cohorts/${cohortId}/faculty${toQuery({ size: 100 })}`, {
        signal,
      }),
  })

export const cohortInvitationsQueryOptions = (cohortId: string, pagination: Pagination) =>
  queryOptions({
    queryKey: [...cohortKeys.detail(cohortId), 'invitations', pagination],
    queryFn: ({ signal }) =>
      cohortRequest<Paged<CohortInvitation>>(
        `/cohorts/${cohortId}/invitations${toQuery(pagination)}`,
        { signal }
      ),
    placeholderData: keepPreviousData,
  })

export const myInvitationsQueryOptions = () =>
  queryOptions({
    queryKey: [...cohortKeys.all, 'my-invitations'],
    queryFn: ({ signal }) => cohortRequest<MyCohortInvitation[]>('/cohort-invitations', { signal }),
  })

/** Profiles a faculty member can invite, by name, login or e-mail. */
export const invitationCandidatesQueryOptions = (cohortId: string, search: string, role: CohortRole) =>
  queryOptions({
    queryKey: [...cohortKeys.detail(cohortId), 'candidates', role, search],
    queryFn: ({ signal }) =>
      cohortRequest<InvitationCandidate[]>(
        `/cohorts/${cohortId}/invitations/candidates${toQuery({ q: search, role })}`,
        { signal }
      ),
    enabled: search.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

/** The cohort's current code, or `null` when none is valid. */
export const invitationCodeQueryOptions = (cohortId: string) =>
  queryOptions({
    queryKey: [...cohortKeys.detail(cohortId), 'invitation-code'],
    queryFn: async ({ signal }) => {
      try {
        return await cohortRequest<InvitationCode>(`/cohorts/${cohortId}/invitation-code`, { signal })
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
      }
    },
  })

/**
 * Where a cohort lives in the app. Joining answers with the cohort's id only,
 * and the app's address for a cohort needs its slug and public code, so they
 * are looked up in the profile's own list.
 */
export async function findCohort(cohortId: string): Promise<Cohort | null> {
  for (let page = 0; ; page++) {
    const result = await cohortRequest<Paged<Cohort>>(
      `/cohorts${toQuery({ page, size: 100, sortBy: 'createdAt', sortDirection: 'desc' })}`
    )
    const match = result.content.find((cohort) => cohort.id === cohortId)
    if (match) return match
    if (page + 1 >= result.totalPages) return null
  }
}

/* ---------------------------------------------------------------------------
   Mutations. A cohort's lists all hang under its detail key, so one
   invalidation refreshes whatever a change can have touched.
--------------------------------------------------------------------------- */

async function changed<T>(request: Promise<T>) {
  const result = await request
  await queryClient.invalidateQueries({ queryKey: cohortKeys.all })
  return result
}

export const createCohort = (body: CohortBody) =>
  changed(cohortRequest<Cohort>('/cohorts', { method: 'POST', body }))

/*
  The cohort is read by its public code, which a rename keeps, so the answer
  is stored as is and only the lists are refreshed. The caller moves to the
  address with the new slug.
*/
export async function updateCohort(cohortId: string, body: CohortBody & { slug: string }) {
  const cohort = await cohortRequest<Cohort>(`/cohorts/${cohortId}`, { method: 'PUT', body })
  queryClient.setQueryData(cohortQueryOptions(cohort.publicCode).queryKey, cohort)
  await queryClient.invalidateQueries({ queryKey: [...cohortKeys.all, 'list'] })
  return cohort
}

export const changeCohortStatus = (cohortId: string, status: CohortState) =>
  changed(cohortRequest<Cohort>(`/cohorts/${cohortId}/status`, { method: 'PATCH', body: { status } }))

/* Leaves the open page alone; refetching it would only find it gone. */
export async function deleteCohort(cohortId: string) {
  await cohortRequest<void>(`/cohorts/${cohortId}`, { method: 'DELETE' })
  await queryClient.invalidateQueries({ queryKey: [...cohortKeys.all, 'list'] })
}

export const removeMember = (cohortId: string, profileId: string) =>
  changed(cohortRequest<void>(`/cohorts/${cohortId}/members/${profileId}`, { method: 'DELETE' }))

export const generateInvitationCode = (cohortId: string, expiresAt?: string) =>
  changed(
    cohortRequest<CreatedInvitationCode>(`/cohorts/${cohortId}/invitation-code`, {
      method: 'POST',
      body: expiresAt ? { expiresAt } : {},
    })
  )

export const revokeInvitationCode = (cohortId: string) =>
  changed(cohortRequest<void>(`/cohorts/${cohortId}/invitation-code`, { method: 'DELETE' }))

export const joinWithCode = (code: string) =>
  changed(
    cohortRequest<CohortMembership>(`/cohort-invitation-codes/${encodeURIComponent(code)}/join`, {
      method: 'POST',
    })
  )

export const sendInvitation = (
  cohortId: string,
  body: { profileId: string; role: CohortRole; expiresAt?: string }
) => changed(cohortRequest<CohortInvitation>(`/cohorts/${cohortId}/invitations`, { method: 'POST', body }))

export const revokeInvitation = (cohortId: string, profileId: string) =>
  changed(cohortRequest<void>(`/cohorts/${cohortId}/invitations/${profileId}`, { method: 'DELETE' }))

export const acceptInvitation = (cohortId: string) =>
  changed(cohortRequest<CohortMembership>(`/cohorts/${cohortId}/invitations/accept`, { method: 'POST' }))
