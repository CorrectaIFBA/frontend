import type { UseFormReturn } from 'react-hook-form'
import type { CreateProfileValues } from '@/features/create-profile/model/create-profile-schema'
import { FormSection } from '@/features/create-profile/ui/form-section'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

type AccountSectionProps = {
  form: UseFormReturn<CreateProfileValues>
}

export function AccountSection({ form }: AccountSectionProps) {
  return (
    <FormSection hint="Como a pessoa entra no Correcta." title="Conta de acesso">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input autoComplete="off" className="h-9" type="email" {...field} />
            </FormControl>
            <FormDescription className="text-xs">O link de ativação vai para este endereço.</FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="login"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Login</FormLabel>
            <FormControl>
              <Input
                autoCapitalize="none"
                autoComplete="off"
                className="h-9 font-mono"
                placeholder="matrícula ou usuário"
                spellCheck={false}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </FormSection>
  )
}
