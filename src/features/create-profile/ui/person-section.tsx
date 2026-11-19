import type { UseFormReturn } from 'react-hook-form'
import { CpfInput, LinkedPerson, NameFields, PersonLookupNotice, type usePersonLookup } from '@/entities/person'
import type { CreateProfileValues } from '@/features/create-profile/model/create-profile-schema'
import type { ProfileOwner } from '@/features/create-profile/model/use-create-profile'
import { FormSection } from '@/features/create-profile/ui/form-section'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'

type PersonSectionProps = {
  form: UseFormReturn<CreateProfileValues>
  person?: ProfileOwner
  lookup: ReturnType<typeof usePersonLookup>
  registersPerson: boolean
}

export function PersonSection({ form, person, lookup, registersPerson }: PersonSectionProps) {
  return (
    <FormSection hint="Encontrada pelo CPF ou cadastrada agora." title="Pessoa">
      {person ? (
        <LinkedPerson hint="O perfil será associado a esta pessoa." person={person} />
      ) : (
        <>
          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <CpfInput autoFocus {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <PersonLookupNotice
            existingHint="O perfil será associado a esta pessoa já cadastrada."
            lookup={lookup}
            newHint="Nenhuma pessoa com este CPF. Ela será cadastrada junto com o perfil."
          />
          {registersPerson ? <NameFields form={form} /> : null}
        </>
      )}
    </FormSection>
  )
}
