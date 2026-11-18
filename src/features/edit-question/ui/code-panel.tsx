import type { QuestionEditorState } from '@/features/edit-question/model/use-question-editor'
import { HarnessCheck } from '@/features/edit-question/ui/harness-check'
import { HarnessField } from '@/features/edit-question/ui/harness-field'
import { LanguagePicker } from '@/features/edit-question/ui/language-picker'
import { LanguageTabs } from '@/features/edit-question/ui/language-tabs'
import { SectionLabel } from '@/features/edit-question/ui/section-label'
import { StarterCodeField } from '@/features/edit-question/ui/starter-code-field'
import { PROGRAMMING_LANGUAGES } from '@/shared/api/assessments'
import { LANGUAGE_LABEL } from '@/shared/editor/languages'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

type CodePanelProps = {
  editor: QuestionEditorState
}

export function CodePanel({ editor }: CodePanelProps) {
  const { form, allowed, language, setEditing, toggleLanguage } = editor

  return (
    <Panel>
      <PanelHeading title={PROGRAMMING_LANGUAGES.length > 1 ? 'Código' : `Código em ${LANGUAGE_LABEL[language]}`} />
      {/* With a single supported language there is nothing to choose. */}
      {PROGRAMMING_LANGUAGES.length > 1 ? <LanguagePicker allowed={allowed} onToggle={toggleLanguage} /> : null}
      {allowed.length > 1 ? <LanguageTabs allowed={allowed} current={language} onSelect={setEditing} /> : null}
      <SectionLabel hint="Escondido do estudante. Roda o código dele contra os casos de teste." title="Harness" />
      <HarnessField form={form} language={language} />

      <HarnessCheck draft={form.watch(`drafts.${language}`)} harness={form.watch(`harnesses.${language}`)} />

      <SectionLabel hint="O que o estudante recebe." title="Código inicial" />
      <StarterCodeField form={form} language={language} />
    </Panel>
  )
}
