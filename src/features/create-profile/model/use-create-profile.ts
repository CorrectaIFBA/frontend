import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { usePersonLookup } from '@/entities/person'
import { PROFILE_KINDS } from '@/entities/profile'
import { type CreateProfileValues, createProfileSchema } from '@/features/create-profile/model/create-profile-schema'
import { createProfile, type Person } from '@/shared/api/directory'
import type { ProfileType } from '@/shared/api/identity'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'
import { formatCpf, normalizeCpf } from '@/shared/lib/cpf'

export type ProfileOwner = Pick<Person, 'id' | 'displayName' | 'documentNumber'>

/* The create-profile form: CPF lookup, the request and where to go after it. */
export function useCreateProfile(person: ProfileOwner | undefined, defaultType: ProfileType) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const defaults: CreateProfileValues = {
    type: defaultType,
    documentNumber: person ? formatCpf(person.documentNumber) : '',
    legalName: '',
    socialName: '',
    email: '',
    login: '',
  }
  const form = useForm<CreateProfileValues>({ resolver: zodResolver(createProfileSchema), defaultValues: defaults })
  const lookup = usePersonLookup(person ? '' : form.watch('documentNumber'))
  const registersPerson = !person && lookup.enabled && !lookup.checking && !lookup.person

  const mutation = useMutation({
    mutationFn: (values: CreateProfileValues) =>
      createProfile({
        type: values.type,
        email: values.email,
        credential: { login: values.login },
        person: {
          documentNumber: normalizeCpf(values.documentNumber),
          legalName: values.legalName || undefined,
          socialName: values.socialName || undefined,
        },
      }),
    onSuccess: (owner, values) => {
      setOpen(false)
      toast.success('Perfil criado. O link de ativação foi enviado por e-mail.')

      const created = owner.institutionalProfiles.find((profile) => profile.credentials.login === values.login.trim())

      if (created) {
        navigate({ to: `${PROFILE_KINDS[created.type].url}/$profileId`, params: { profileId: created.id } })
      } else {
        navigate({ to: '/persons/$personId', params: { personId: owner.id } })
      }
    },
    onError: (error) =>
      applyFieldErrors(form, error, {
        'person.documentNumber': 'documentNumber',
        'person.legalName': 'legalName',
        'person.socialName': 'socialName',
        'credential.login': 'login',
      }),
  })

  function submit(values: CreateProfileValues) {
    // Only a new person needs a name; an existing one keeps theirs.
    if (registersPerson && !values.legalName) {
      form.setError('legalName', { message: 'Informe o nome civil da nova pessoa.' })

      return
    }

    mutation.mutate(values)
  }

  function onOpenChange(next: boolean) {
    setOpen(next)

    if (!next) {
      form.reset(defaults)
      mutation.reset()
    }
  }

  return { open, setOpen, onOpenChange, form, lookup, registersPerson, mutation, submit }
}
