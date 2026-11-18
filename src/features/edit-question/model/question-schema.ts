import { z } from 'zod'
import { type AssessmentQuestion, PROGRAMMING_LANGUAGES, type ProgrammingLanguage } from '@/shared/api/assessments'
import { STARTER_CODE } from '@/shared/editor/languages'
import { slugField } from '@/shared/lib/slug-field'

const draftField = z.string().max(65535, 'Use no máximo 65535 caracteres.')

export const questionSchema = z.object({
  title: z.string().trim().min(1, 'Dê um título à questão.').max(255, 'Use no máximo 255 caracteres.'),
  slug: slugField,
  statement: z.string().trim().min(1, 'Escreva o enunciado da questão.'),
  maximumGrade: z
    .string()
    .trim()
    .regex(/^\d{1,3}([.,]\d{1,2})?$/, 'Use um número de 0 a 999,99, com até duas casas decimais.'),
  allowed: z.array(z.enum(PROGRAMMING_LANGUAGES)).min(1, 'Permita ao menos uma linguagem.'),
  /*
    A draft for every language, allowed or not: turning a language off and
    on again brings its code back. Only the allowed ones are sent.
  */
  drafts: z.record(z.enum(PROGRAMMING_LANGUAGES), draftField),
  // Same shape: the code that runs the student's, per language. Empty runs their code as is.
  harnesses: z.record(z.enum(PROGRAMMING_LANGUAGES), draftField),
  allowCopyPasting: z.boolean(),
})

export type QuestionValues = z.infer<typeof questionSchema>

export function initialValues(question?: AssessmentQuestion): QuestionValues {
  const drafts = { ...STARTER_CODE }
  const harnesses = Object.fromEntries(PROGRAMMING_LANGUAGES.map((item) => [item, ''])) as Record<ProgrammingLanguage, string>
  for (const draft of question?.codeDrafts ?? []) {
    drafts[draft.language] = draft.code
    harnesses[draft.language] = draft.harness ?? ''
  }

  return {
    title: question?.title ?? '',
    slug: question?.slug ?? '',
    statement: question?.statement ?? '',
    maximumGrade: question ? String(question.maximumGrade).replace('.', ',') : '',
    allowed: question ? question.codeDrafts.map((draft) => draft.language) : [PROGRAMMING_LANGUAGES[0]],
    drafts,
    harnesses,
    allowCopyPasting: question?.allowCopyPasting ?? true,
  }
}
