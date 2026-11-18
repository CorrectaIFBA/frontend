import type { UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

export function NameFields<T extends { legalName: string; socialName: string }>({
  form,
}: {
  form: UseFormReturn<T>
}) {
  // react-hook-form cannot narrow generic paths; these two names are guaranteed by T.
  const control = form.control as unknown as UseFormReturn<{ legalName: string; socialName: string }>['control']

  return (
    <>
      <FormField
        control={control}
        name="legalName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome civil</FormLabel>
            <FormControl>
              <Input className="h-9" placeholder="Como consta no documento" {...field} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="socialName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome social <span className="font-normal text-muted-foreground">(opcional)</span>
            </FormLabel>
            <FormControl>
              <Input className="h-9" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Exibido no lugar do nome civil.
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </>
  )
}
