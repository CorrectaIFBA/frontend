import { useState } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { QuestionValues } from '@/features/edit-question/model/question-schema'
import { StatementPreview } from '@/features/edit-question/ui/statement-preview'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'
import { Segmented } from '@/shared/ui/segmented'
import { Textarea } from '@/shared/ui/textarea'

type StatementPanelProps = {
  form: UseFormReturn<QuestionValues>
}

export function StatementPanel({ form }: StatementPanelProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  return (
    <Panel>
      <PanelHeading
        action={
          <Segmented
            label="Modo do enunciado"
            onChange={setTab}
            options={[
              { value: 'write', label: 'Escrever' },
              { value: 'preview', label: 'Visualizar' },
            ]}
            value={tab}
          />
        }
        title="Enunciado"
      />
      <div className="p-4">
        {tab === 'write' ? (
          <Controller
            control={form.control}
            name="statement"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <Textarea
                  aria-invalid={Boolean(fieldState.error)}
                  aria-label="Enunciado"
                  className="min-h-72 font-mono text-[12.5px]! leading-relaxed"
                  placeholder={'Escreva o problema, a entrada e a saída esperadas.\n\n## Entrada\n...\n\n## Saída\n...'}
                  rows={14}
                  {...field}
                />
                {fieldState.error ? (
                  <p className="text-destructive text-xs">{fieldState.error.message}</p>
                ) : (
                  <p className="text-muted-foreground text-xs">Aceita Markdown.</p>
                )}
              </div>
            )}
          />
        ) : (
          <StatementPreview statement={form.watch('statement')} />
        )}
      </div>
    </Panel>
  )
}
