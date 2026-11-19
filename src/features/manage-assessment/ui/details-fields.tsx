import { type Control, useWatch } from 'react-hook-form'
import type { DetailsValues } from '@/features/manage-assessment/model/assessment-schema'
import { slugify } from '@/shared/lib/slugify'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { SlugInput } from '@/shared/ui/slug-input'
import { SlugInputField } from '@/shared/ui/slug-input-field'
import { Textarea } from '@/shared/ui/textarea'

/** Title, instructions and due date: the fields shared by creating and editing. */
export function DetailsFields<T extends DetailsValues>({
  control: controlOfForm,
  autoFocus,
  editing,
}: {
  control: Control<T>
  autoFocus?: boolean
  /** An existing activity: its address is kept when the field is cleared, and changing it breaks old links. */
  editing?: boolean
}) {
  // react-hook-form cannot narrow generic paths; these names are guaranteed by T.
  const control = controlOfForm as unknown as Control<DetailsValues>
  const title = useWatch({ control, name: 'title' })

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input autoFocus={autoFocus} className="h-9" placeholder="Lista 3 — Árvores binárias" {...field} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <SlugInput prefix="/activities/">
              <FormControl>
                <SlugInputField placeholder={slugify(title) || 'gerado-pelo-titulo'} {...field} />
              </FormControl>
            </SlugInput>
            <FormDescription className="text-xs">
              {editing
                ? 'Mudar o endereço invalida links antigos.'
                : 'Único nesta turma. Deixe em branco para gerar a partir do título.'}
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instruções</FormLabel>
            <FormControl>
              <Textarea placeholder="O que entregar, como será avaliado, material de apoio." rows={4} {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Aceita Markdown.
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prazo de entrega</FormLabel>
            <FormControl>
              <Input className="h-9 w-fit" type="datetime-local" {...field} />
            </FormControl>
            <FormDescription className="text-xs">Deixe em branco para uma atividade sem prazo.</FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </>
  )
}
