import { useForm } from 'react-hook-form'
import type { CohortValues } from '@/entities/cohort/model/cohort-schema'
import { slugify } from '@/shared/lib/slugify'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { SlugInput } from '@/shared/ui/slug-input'
import { SlugInputField } from '@/shared/ui/slug-input-field'
import { Textarea } from '@/shared/ui/textarea'

/** Name, address and description: the fields shared by creating and editing. */
export function CohortFields({
  form,
  slugRequired,
  publicCode,
  autoFocus,
}: {
  form: ReturnType<typeof useForm<CohortValues>>
  slugRequired?: boolean
  /** The existing cohort's code, shown after the slug as the address has it. */
  publicCode?: string
  autoFocus?: boolean
}) {
  const name = form.watch('name')

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input autoFocus={autoFocus} className="h-9" placeholder="Estruturas de Dados — 2026.2" {...field} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <SlugInput prefix="/classes/" suffix={`-${publicCode ?? 'código'}`}>
              <FormControl>
                <SlugInputField placeholder={slugRequired ? undefined : slugify(name) || 'gerado-pelo-nome'} {...field} />
              </FormControl>
            </SlugInput>
            <FormDescription className="text-xs">
              {slugRequired
                ? 'Links antigos continuam funcionando.'
                : 'Deixe em branco para gerar a partir do nome.'}
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Período, horário, sala ou o que os estudantes precisam saber."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </>
  )
}
