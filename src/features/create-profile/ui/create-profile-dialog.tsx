import { LoaderCircle, UserPlus } from 'lucide-react'
import type { ReactNode } from 'react'
import { type ProfileOwner, useCreateProfile } from '@/features/create-profile/model/use-create-profile'
import { AccountSection } from '@/features/create-profile/ui/account-section'
import { PersonSection } from '@/features/create-profile/ui/person-section'
import { ProfileTypePicker } from '@/features/create-profile/ui/profile-type-picker'
import { errorMessage } from '@/shared/api/errors'
import type { ProfileType } from '@/shared/api/identity'
import { Button } from '@/shared/ui/button'
import { DialogActions } from '@/shared/ui/dialog-actions'
import { Form, FormField, FormItem, FormLabel } from '@/shared/ui/form'
import { FormAlert } from '@/shared/ui/form-alert'
import { FormDialog } from '@/shared/ui/form-dialog'

type CreateProfileDialogProps = {
  trigger: ReactNode
  person?: ProfileOwner
  defaultType?: ProfileType
}

/**
 * A full institutional profile: the person (found by CPF, or registered on
 * the spot), the profile and its login. The service mails an activation link
 * to the e-mail given here.
 *
 * Given `person`, the dialog is for that person only and skips the lookup.
 */
export function CreateProfileDialog({ trigger, person, defaultType = 'STUDENT' }: CreateProfileDialogProps) {
  const { open, setOpen, onOpenChange, form, lookup, registersPerson, mutation, submit } = useCreateProfile(person, defaultType)

  return (
    <FormDialog
      description="A pessoa recebe por e-mail o link para definir a senha."
      onOpenChange={onOpenChange}
      open={open}
      icon={UserPlus}
      title={person ? `Novo perfil para ${person.displayName}` : 'Novo perfil institucional'}
      trigger={trigger}
    >
      <Form {...form}>
        <form className="flex flex-col gap-5" noValidate onSubmit={form.handleSubmit(submit)}>
          <FormAlert message={mutation.isError ? errorMessage(mutation.error) : null} />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de perfil</FormLabel>
                <ProfileTypePicker onChange={field.onChange} value={field.value} />
              </FormItem>
            )}
          />

          <PersonSection form={form} lookup={lookup} person={person} registersPerson={registersPerson} />
          <AccountSection form={form} />

          <DialogActions>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={mutation.isPending || lookup.checking} type="submit">
              {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
              Criar perfil
            </Button>
          </DialogActions>
        </form>
      </Form>
    </FormDialog>
  )
}
