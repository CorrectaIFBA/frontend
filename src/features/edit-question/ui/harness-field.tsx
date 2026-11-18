import { WandSparkles } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { QuestionValues } from '@/features/edit-question/model/question-schema'
import { GenerateHarness } from '@/features/edit-question/ui/generate-harness'
import type { ProgrammingLanguage } from '@/shared/api/assessments'
import { CodeEditor } from '@/shared/editor/code-editor'
import { LANGUAGE_LABEL, STARTER_HARNESS } from '@/shared/editor/languages'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

type HarnessFieldProps = {
  form: UseFormReturn<QuestionValues>
  language: ProgrammingLanguage
}

export function HarnessField({ form, language }: HarnessFieldProps) {
  return (
    <Controller
      control={form.control}
      key={`harness-${language}`}
      name={`harnesses.${language}`}
      render={({ field, fieldState }) => (
        <>
          <CodeEditor
            ariaLabel={`Harness em ${LANGUAGE_LABEL[language]}`}
            height={260}
            language={language}
            onChange={field.onChange}
            value={field.value}
          />
          <div className="flex flex-wrap items-center gap-3 border-border border-t bg-muted/40 px-4 py-2.5">
            <p className={cn('flex-1 text-xs', fieldState.error ? 'text-destructive' : 'text-muted-foreground')}>
              {fieldState.error?.message ??
                'Declare como protótipo a função do estudante e chame-a no main. Vazio, o código roda como está.'}
            </p>
            <GenerateHarness
              current={field.value}
              draft={form.watch(`drafts.${language}`)}
              onGenerate={(code) => form.setValue(`harnesses.${language}`, code, { shouldDirty: true })}
            />
            {field.value !== STARTER_HARNESS[language] ? (
              <ConfirmDialog
                action={async () => form.setValue(`harnesses.${language}`, STARTER_HARNESS[language], { shouldDirty: true })}
                confirmLabel="Usar modelo"
                description="Substitui o harness atual por um main que lê da entrada padrão e chama a função do estudante."
                successMessage="Modelo inserido."
                title={`Usar o modelo de harness de ${LANGUAGE_LABEL[language]}?`}
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
