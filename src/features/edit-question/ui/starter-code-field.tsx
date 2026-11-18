import { WandSparkles } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { QuestionValues } from '@/features/edit-question/model/question-schema'
import type { ProgrammingLanguage } from '@/shared/api/assessments'
import { CodeEditor } from '@/shared/editor/code-editor'
import { LANGUAGE_LABEL, STARTER_CODE } from '@/shared/editor/languages'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

type StarterCodeFieldProps = {
  form: UseFormReturn<QuestionValues>
  language: ProgrammingLanguage
}

export function StarterCodeField({ form, language }: StarterCodeFieldProps) {
  return (
    <Controller
      control={form.control}
      key={language}
      name={`drafts.${language}`}
      render={({ field, fieldState }) => (
        <>
          <CodeEditor
            ariaLabel={`Código inicial em ${LANGUAGE_LABEL[language]}`}
            height={340}
            language={language}
            onChange={field.onChange}
            value={field.value}
          />
          <div className="flex flex-wrap items-center gap-3 border-border border-t bg-muted/40 px-4 py-2.5">
            <p className={cn('flex-1 text-xs', fieldState.error ? 'text-destructive' : 'text-muted-foreground')}>
              {fieldState.error?.message ?? 'O estudante começa com este código. Ctrl+Espaço mostra sugestões.'}
            </p>
            {field.value !== STARTER_CODE[language] ? (
              <ConfirmDialog
                action={async () => form.setValue(`drafts.${language}`, STARTER_CODE[language], { shouldDirty: true })}
                confirmLabel="Usar modelo"
                description="O código atual é substituído por um programa mínimo que lê da entrada padrão."
                successMessage="Modelo inserido."
                title={`Usar o modelo de ${LANGUAGE_LABEL[language]}?`}
                trigger={
                  <Button size="xs" type="button" variant="ghost-muted">
                    <WandSparkles /> Usar modelo
                  </Button>
                }
              />
            ) : null}
          </div>
        </>
      )}
    />
  )
}
