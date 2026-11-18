import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useBlocker, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCohortView } from '@/entities/cohort'
import { initialValues, questionSchema, type QuestionValues } from '@/features/edit-question/model/question-schema'
import {
  type Assessment,
  type AssessmentQuestion,
  assessmentKeys,
  createQuestion,
  editQuestion,
  PROGRAMMING_LANGUAGES,
  type ProgrammingLanguage,
} from '@/shared/api/assessments'
import { cohortAddress } from '@/shared/api/cohorts'
import { queryClient } from '@/shared/api/query-client'
import { applyFieldErrors } from '@/shared/lib/apply-field-errors'

const parseMaximumGrade = (text: string) => Number(text.replace(',', '.'))

/*
  Form state, language selection, saving and the leave guard of the question
  editor. Changing an existing question's maximum grade asks first: the grades
  already given in it rescale by the same ratio.
*/
export function useQuestionEditor(assessment: Assessment, question?: AssessmentQuestion) {
  const { cohort } = useCohortView()
  const navigate = useNavigate()
  const leaving = useRef(false)
  const form = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialValues(question),
  })
  const allowed = form.watch('allowed')
  const [editing, setEditing] = useState<ProgrammingLanguage>(allowed[0])
  const [pendingGradeChange, setPendingGradeChange] = useState<QuestionValues | null>(null)
  // The tab shown follows the allowed set: turning off the open language moves to another.
  const language = allowed.includes(editing) ? editing : allowed[0]

  const backToActivity = () => {
    leaving.current = true
    navigate({
      to: '/classes/$cohortRef/activities/$assessmentSlug',
      params: { cohortRef: cohortAddress(cohort), assessmentSlug: assessment.slug },
    })
  }

  const blocker = useBlocker({
    shouldBlockFn: () => form.formState.isDirty && !leaving.current,
    enableBeforeUnload: () => form.formState.isDirty && !leaving.current,
    withResolver: true,
  })

  const mutation = useMutation({
    mutationFn: (values: QuestionValues) => {
      const body = {
        title: values.title,
        // Left empty, a new question's address comes from its title and an existing one keeps its own.
        slug: values.slug || undefined,
        statement: values.statement,
        maximumGrade: parseMaximumGrade(values.maximumGrade),
        codeDrafts: PROGRAMMING_LANGUAGES.filter((item) => values.allowed.includes(item)).map((item) => ({
          language: item,
          code: values.drafts[item],
          harness: values.harnesses[item],
        })),
        allowCopyPasting: values.allowCopyPasting,
      }

      return question ? editQuestion(assessment.id, question, body) : createQuestion(assessment.id, body)
    },
    onSuccess: async (_saved, values) => {
      // The rescaled grades change every student's activity grade, in lists and details alike.
      if (question && parseMaximumGrade(values.maximumGrade) !== Number(question.maximumGrade)) {
        await queryClient.invalidateQueries({ queryKey: assessmentKeys.all })
      }

      setPendingGradeChange(null)
      toast.success(question ? 'Questão salva.' : 'Questão adicionada.')
      backToActivity()
    },
    onError: (error) => applyFieldErrors(form, error, { codeDrafts: 'allowed' }),
  })

  const submit = (values: QuestionValues) => {
    if (question && parseMaximumGrade(values.maximumGrade) !== Number(question.maximumGrade)) {
      setPendingGradeChange(values)

      return
    }

    mutation.mutate(values)
  }

  const gradeChange = {
    /** Old and new maximum grade, while the confirmation is open. */
    pending: pendingGradeChange && question
      ? { from: Number(question.maximumGrade), to: parseMaximumGrade(pendingGradeChange.maximumGrade) }
      : null,
    confirm: () => pendingGradeChange && mutation.mutate(pendingGradeChange),
    cancel: () => {
      setPendingGradeChange(null)
      mutation.reset()
    },
  }

  const toggleLanguage = (item: ProgrammingLanguage) => {
    const next = allowed.includes(item) ? allowed.filter((other) => other !== item) : [...allowed, item]

    if (!next.length) return

    form.setValue(
      'allowed',
      PROGRAMMING_LANGUAGES.filter((other) => next.includes(other)),
      { shouldDirty: true, shouldValidate: true }
    )

    if (!allowed.includes(item)) setEditing(item)
  }

  return { form, allowed, language, setEditing, toggleLanguage, backToActivity, blocker, mutation, submit, gradeChange }
}

export type QuestionEditorState = ReturnType<typeof useQuestionEditor>
