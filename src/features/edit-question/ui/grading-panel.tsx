import { Controller, type UseFormReturn } from 'react-hook-form'
import type { QuestionValues } from '@/features/edit-question/model/question-schema'
import { Input } from '@/shared/ui/input'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { Switch } from '@/shared/ui/switch'

type GradingPanelProps = {
  form: UseFormReturn<QuestionValues>
}

export function GradingPanel({ form }: GradingPanelProps) {
  return (
    <Panel>
      <PanelHeading title="Avaliação" />
      <div className="flex flex-col divide-y divide-border/70 px-4">
        <Controller
          control={form.control}
          name="maximumGrade"
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1.5 py-3">
              <span className="flex items-center justify-between gap-4">
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium text-sm">Nota máxima</span>
                  <span className="text-muted-foreground text-xs">A nota da atividade é a média das questões.</span>
                </span>
                <span className="flex items-center gap-2">
                  <Input
                    aria-invalid={Boolean(fieldState.error)}
                    className="h-8 w-20 text-right"
                    inputMode="decimal"
                    placeholder="2,5"
                    {...field}
                  />
                  <span className="text-muted-foreground text-xs">pontos</span>
                </span>
              </span>
              {fieldState.error ? <span className="text-destructive text-xs">{fieldState.error.message}</span> : null}
            </label>
          )}
        />
        <Controller
          control={form.control}
          name="allowCopyPasting"
          render={({ field }) => (
            <label className="flex items-center justify-between gap-4 py-3">
              <span className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">Permitir copiar e colar</span>
                <span className="text-muted-foreground text-xs">
                  Desligado, só é possível colar o que foi copiado do próprio editor.
                </span>
              </span>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </label>
          )}
        />
      </div>
    </Panel>
  )
}
