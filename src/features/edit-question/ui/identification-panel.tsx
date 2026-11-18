import { Controller, type UseFormReturn } from 'react-hook-form'
import type { QuestionValues } from '@/features/edit-question/model/question-schema'
import type { Assessment } from '@/shared/api/assessments'
import { cn } from '@/shared/lib/cn'
import { slugify } from '@/shared/lib/slugify'
import { Input } from '@/shared/ui/input'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { SlugInput } from '@/shared/ui/slug-input'
import { SlugInputField } from '@/shared/ui/slug-input-field'

type IdentificationPanelProps = {
  assessment: Assessment
  form: UseFormReturn<QuestionValues>
  isNew: boolean
}

export function IdentificationPanel({ assessment, form, isNew }: IdentificationPanelProps) {
  return (
    <Panel>
      <PanelHeading title="Identificação" />
      <div className="flex flex-col divide-y divide-border/70 px-4">
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1.5 py-3">
              <span className="font-medium text-sm">Título</span>
              <Input
                aria-invalid={Boolean(fieldState.error)}
                autoFocus={isNew}
                className="h-9"
                placeholder="Soma de dois números"
                {...field}
              />
              {fieldState.error ? (
                <span className="text-destructive text-xs">{fieldState.error.message}</span>
              ) : (
                <span className="text-muted-foreground text-xs">Aparece na lista de questões e no topo da questão.</span>
              )}
            </label>
          )}
        />
        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1.5 py-3">
              <span className="font-medium text-sm">Endereço</span>
              <SlugInput prefix={`/${assessment.slug}/questions/`}>
                <SlugInputField
                  aria-invalid={Boolean(fieldState.error)}
                  placeholder={slugify(form.watch('title')) || 'gerado-pelo-titulo'}
                  {...field}
                />
              </SlugInput>
              <span className={cn('text-xs', fieldState.error ? 'text-destructive' : 'text-muted-foreground')}>
                {fieldState.error?.message ??
                  (isNew
                    ? 'Único nesta atividade. Deixe em branco para gerar a partir do título.'
                    : 'Mudar o endereço invalida links antigos.')}
              </span>
            </label>
          )}
        />
      </div>
    </Panel>
  )
}
