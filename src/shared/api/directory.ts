import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { ProfileState, ProfileType } from '@/shared/api/identity'
import { queryClient } from '@/shared/api/query-client'
import { authedRequest } from '@/shared/api/session'

/*
  Persons and their institutional profiles, as the identity service exposes
  them to staff. Every call goes out as the signed-in account.
*/

export type SortDirection = 'asc' | 'desc'

export type Paged<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  sortBy: string
  sortDirection: SortDirection
}

export type Pagination = {
  page: number
  size: number
  sortBy: string
  sortDirection: SortDirection
}

export type Person = {
  id: string
  documentNumber: string
  displayName: string
  firstName: string
  createdAt: string
}

export type InstitutionalProfile = {
  id: string
  personId: string
  type: ProfileType
  email: string
  state: ProfileState
  credentials: { login: string }
  createdAt: string
}

export type DetailedPerson = Person & {
  legalName: string
  socialName: string | null
  active: boolean
  institutionalProfiles: InstitutionalProfile[]
}

export type PersonFilter = { search?: string; active?: boolean }

export type ProfileFilter = {
  search?: string
  personId?: string
  type?: ProfileType
  state?: ProfileState
  email?: string
}

export type PersonReference = {
  documentNumber: string
  legalName?: string
  socialName?: string
}

export type CreateProfileBody = {
  type: ProfileType
  email: string
  person: PersonReference
  credential: { login: string }
}

/** The fields each list endpoint accepts in `sortBy`. */
export const PERSON_SORT_FIELDS = ['createdAt', 'updatedAt', 'legalName', 'documentNumber'] as const

export const PROFILE_SORT_FIELDS = ['createdAt', 'updatedAt', 'email', 'type', 'state'] as const

export function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const text = query.toString()
  return text ? `?${text}` : ''
}

/* ---------------------------------------------------------------------------
   Queries
--------------------------------------------------------------------------- */

export const directoryKeys = {
  persons: ['directory', 'persons'] as const,
  profiles: ['directory', 'profiles'] as const,
}

export const personsQueryOptions = (filter: PersonFilter, pagination: Pagination) =>
  queryOptions({
    queryKey: [...directoryKeys.persons, 'list', filter, pagination],
    queryFn: ({ signal }) =>
      authedRequest<Paged<Person>>(`/persons${toQuery({ ...filter, ...pagination })}`, { signal }),
    placeholderData: keepPreviousData,
  })

export const personQueryOptions = (personId: string) =>
  queryOptions({
    queryKey: [...directoryKeys.persons, 'detail', personId],
    queryFn: ({ signal }) => authedRequest<DetailedPerson>(`/persons/${personId}`, { signal }),
  })

export const profilesQueryOptions = (filter: ProfileFilter, pagination: Pagination) =>
  queryOptions({
    queryKey: [...directoryKeys.profiles, 'list', filter, pagination],
    queryFn: ({ signal }) =>
      authedRequest<Paged<InstitutionalProfile>>(
        `/institutional-profiles${toQuery({ ...filter, ...pagination })}`,
        { signal }
      ),
    placeholderData: keepPreviousData,
  })

export const profileQueryOptions = (profileId: string) =>
  queryOptions({
    queryKey: [...directoryKeys.profiles, 'detail', profileId],
    queryFn: ({ signal }) =>
      authedRequest<InstitutionalProfile>(`/institutional-profiles/${profileId}`, { signal }),
  })

/**
 * The person already registered under a CPF, if any. The list search also
 * matches names and partial numbers, so only an exact number counts.
 */
export async function findPersonByDocument(documentNumber: string, signal?: AbortSignal) {
  const page = await authedRequest<Paged<Person>>(
    `/persons${toQuery({ search: documentNumber, size: 5 })}`,
    { signal }
  )
  return page.content.find((person) => person.documentNumber === documentNumber) ?? null
}

/* ---------------------------------------------------------------------------
   Mutations. Each refreshes what it can have changed: a person's detail
   embeds their profiles, so both sides go stale together.
--------------------------------------------------------------------------- */

function refreshDirectory() {
  return queryClient.invalidateQueries({ queryKey: ['directory'] })
}

async function changed<T>(request: Promise<T>) {
  const result = await request
  await refreshDirectory()
  return result
}

export const createPerson = (body: PersonReference) =>
  changed(authedRequest<DetailedPerson>('/persons', { method: 'POST', body }))

export const updatePerson = (
  personId: string,
  body: { legalName?: string; socialName?: string }
) => changed(authedRequest<DetailedPerson>(`/persons/${personId}`, { method: 'PATCH', body }))

export const deactivatePerson = (personId: string) =>
  changed(authedRequest<DetailedPerson>(`/persons/${personId}/deactivate`, { method: 'POST' }))

export const reactivatePerson = (personId: string) =>
  changed(authedRequest<DetailedPerson>(`/persons/${personId}/reactivate`, { method: 'POST' }))

/** Creates the profile, and the person too when the CPF is new. */
export const createProfile = (body: CreateProfileBody) =>
  changed(authedRequest<DetailedPerson>('/institutional-profiles', { method: 'POST', body }))

export const updateProfile = (profileId: string, body: { email: string }) =>
  changed(
    authedRequest<InstitutionalProfile>(`/institutional-profiles/${profileId}`, {
      method: 'PATCH',
      body,
    })
  )

export const resendActivation = (profileId: string) =>
  authedRequest<void>(`/institutional-profiles/${profileId}/activation`, { method: 'POST' })

export const deactivateProfile = (profileId: string) =>
  changed(
    authedRequest<InstitutionalProfile>(`/institutional-profiles/${profileId}/deactivate`, {
      method: 'POST',
    })
  )

export const reactivateProfile = (profileId: string) =>
  changed(
    authedRequest<InstitutionalProfile>(`/institutional-profiles/${profileId}/reactivate`, {
      method: 'POST',
    })
  )
