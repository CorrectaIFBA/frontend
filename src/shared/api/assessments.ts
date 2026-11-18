import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { type Paged, type Pagination, toQuery } from '@/shared/api/directory'
import { ASSESSMENT_API_URL, type RawRequest } from '@/shared/api/http'
import { queryClient } from '@/shared/api/query-client'
import { authedRequest } from '@/shared/api/session'
import type { SessionSummary } from '@/shared/api/sessions'

/*
  Assessments (atividades) from the assessment service. Every assessment
  belongs to one cohort, and the service only lists them one cohort at a
  time: faculty see every state, students only published ones.
*/

export type AssessmentState = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type AssessmentParameters = {
  canBeSubmittedAfterDueDate: boolean
  /** Minutes; `null` means no time limit. */
  maximumTimeAllowed: number | null
  /** Whether the editor underlines compilation errors while the student writes; off, only on submission. */
  showCompilationErrors: boolean
  canViewDefinitiveTestcaseScoringAfterSubmission: boolean
  /** Holds the test case score back from the student until every question of their attempt has a grade. */
  showTestcaseScoringOnlyAfterGrading: boolean
  /** Whether the student sees the grades and comments faculty gave them. */
  showAssignedGrades: boolean
}

export type Assessment = {
  id: string
  ownerProfileId: string
  cohortId: string | null
  title: string
  /** The activity's address in its cohort's URL, unique inside the cohort. */
  slug: string
  description: string | null
  state: AssessmentState
  dueDate: string | null
  parameters: (AssessmentParameters & { id: string; updatedAt: string }) | null
  questionCount: number
  /** Sum of the questions' maximum grades. */
  totalGrade: number
  /** The signed-in student's final score, the sum of their question grades; `null` before the first grade, when grades are hidden, and always for faculty. */
  score: number | null
  /** The signed-in student's session, `null` before they start; always `null` for faculty. */
  mySession: SessionSummary | null
  createdAt: string
  updatedAt: string
}

export type AssessmentFilter = {
  cohortId: string
  /** Part of the title. */
  title?: string
  state?: AssessmentState
}

export type AssessmentBody = {
  title: string
  /** Generated from the title when left out on creation; kept when left out on edit. */
  slug?: string
  description?: string
  /** UTC ISO-8601; left out for no due date. */
  dueDate?: string
}

/** Only the fields sent change; `0` removes the time limit. */
export type ParametersChange = Partial<Omit<AssessmentParameters, 'maximumTimeAllowed'>> & {
  maximumTimeAllowed?: number
}
/** The service's defaults for an assessment created without parameters. */
export const DEFAULT_PARAMETERS: AssessmentParameters = {
  canBeSubmittedAfterDueDate: false,
  maximumTimeAllowed: null,
  showCompilationErrors: true,
  canViewDefinitiveTestcaseScoringAfterSubmission: true,
  showTestcaseScoringOnlyAfterGrading: false,
  showAssignedGrades: true,
}

export function assessmentRequest<T>(path: string, options: Omit<RawRequest, 'bearer' | 'baseUrl'> = {}) {
  return authedRequest<T>(path, { ...options, baseUrl: ASSESSMENT_API_URL })
}

/* ---------------------------------------------------------------------------
   Queries
--------------------------------------------------------------------------- */

export const assessmentKeys = {
  all: ['assessments'] as const,
  detail: (assessmentId: string) => ['assessments', 'detail', assessmentId] as const,
}

export const assessmentsQueryOptions = (filter: AssessmentFilter, pagination: Pagination) =>
  queryOptions({
    queryKey: [...assessmentKeys.all, 'list', filter, pagination],
    queryFn: ({ signal }) =>
      assessmentRequest<Paged<Assessment>>(`/assessments${toQuery({ ...filter, ...pagination })}`, { signal }),
    placeholderData: keepPreviousData,
  })

/** Pages address an activity by its cohort and its slug, which is unique inside the cohort. */
export const assessmentBySlugQueryOptions = (cohortId: string, slug: string) =>
  queryOptions({
    queryKey: [...assessmentKeys.all, 'by-slug', cohortId, slug],
    queryFn: ({ signal }) => assessmentRequest<Assessment>(`/assessments/by-slug/${cohortId}/${slug}`, { signal }),
  })

/* ---------------------------------------------------------------------------
   Mutations. Each answers with the whole assessment, so the detail is
   stored as is and only the lists are refetched.
--------------------------------------------------------------------------- */

/*
  Stored under the slug it answers with: a renamed activity is not refetched
  under its old address, which would no longer find it; the caller moves to
  the new one.
*/
async function changed(request: Promise<Assessment>) {
  const assessment = await request
  if (assessment.cohortId) {
    queryClient.setQueryData(assessmentBySlugQueryOptions(assessment.cohortId, assessment.slug).queryKey, assessment)
  }
  await queryClient.invalidateQueries({ queryKey: [...assessmentKeys.all, 'list'] })
  return assessment
}

export const createAssessment = (
  body: AssessmentBody & { cohortId: string; parameters?: AssessmentParameters }
) => changed(assessmentRequest<Assessment>('/assessments', { method: 'POST', body }))

/** Replaces title, description and due date; a missing description or due date clears it. */
export const editAssessment = (assessmentId: string, body: AssessmentBody) =>
  changed(assessmentRequest<Assessment>(`/assessments/${assessmentId}/edit`, { method: 'POST', body }))

export const publishAssessment = (assessmentId: string) =>
  changed(assessmentRequest<Assessment>(`/assessments/${assessmentId}/publish`, { method: 'POST' }))

export const archiveAssessment = (assessmentId: string) =>
  changed(assessmentRequest<Assessment>(`/assessments/${assessmentId}/archive`, { method: 'POST' }))

export const changeAssessmentParameters = (assessmentId: string, body: ParametersChange) =>
  changed(
    assessmentRequest<Assessment>(`/assessments/${assessmentId}/parameters`, { method: 'PATCH', body })
  )

/* ---------------------------------------------------------------------------
   Questions. Each carries a statement (Markdown) and the draft code handed
   to the student, in one language. Positions are unique per assessment but
   may have gaps, so the order is what counts, not the number.
--------------------------------------------------------------------------- */

/** Only C for now; the rest of the UI still handles a list, so adding one back is a matter of listing it. */
export type ProgrammingLanguage = 'C'

/** In the service's order, so lists read the same everywhere. */
export const PROGRAMMING_LANGUAGES: ProgrammingLanguage[] = ['C']

/** A language the student may answer in, with the code they start from. */
export type CodeDraft = {
  language: ProgrammingLanguage
  code: string
  /** Code that wraps the student's to run the test cases. Faculty only: the service leaves it out for students. */
  harness?: string
}

export type AssessmentQuestion = {
  id: string
  assessmentId: string
  position: number
  title: string
  /** The question's address in its activity's URL, unique inside the activity. */
  slug: string
  statement: string
  /** One per allowed language, never empty, ordered as the service lists them. */
  codeDrafts: CodeDraft[]
  maximumGrade: number
  allowCopyPasting: boolean
  createdAt: string
  updatedAt: string
}

export type QuestionBody = {
  title: string
  /** Generated from the title when left out on creation; kept when left out on edit. */
  slug?: string
  statement: string
  codeDrafts: CodeDraft[]
  maximumGrade: number
  allowCopyPasting: boolean
}

export const questionKeys = {
  list: (assessmentId: string) => [...assessmentKeys.detail(assessmentId), 'questions'] as const,
}

export const questionsQueryOptions = (assessmentId: string) =>
  queryOptions({
    queryKey: questionKeys.list(assessmentId),
    queryFn: ({ signal }) =>
      assessmentRequest<AssessmentQuestion[]>(`/assessments/${assessmentId}/questions`, { signal }),
  })

async function questionsChanged<T>(assessmentId: string, request: Promise<T>) {
  try {
    return await request
  } finally {
    await queryClient.invalidateQueries({ queryKey: questionKeys.list(assessmentId) })
  }
}

/** Every field the edit endpoint replaces, as the question has it now. */
function questionBody(question: AssessmentQuestion) {
  return {
    position: question.position,
    title: question.title,
    slug: question.slug,
    statement: question.statement,
    codeDrafts: question.codeDrafts,
    maximumGrade: question.maximumGrade,
    allowCopyPasting: question.allowCopyPasting,
  }
}

/** Appended after the last question. */
export const createQuestion = (assessmentId: string, body: QuestionBody) =>
  questionsChanged(
    assessmentId,
    assessmentRequest<AssessmentQuestion>(`/assessments/${assessmentId}/questions`, { method: 'POST', body })
  )

/** Replaces every field; the position is kept unless given. */
export const editQuestion = (
  assessmentId: string,
  question: AssessmentQuestion,
  body: Partial<QuestionBody> & { position?: number }
) =>
  questionsChanged(
    assessmentId,
    assessmentRequest<AssessmentQuestion>(`/assessments/${assessmentId}/questions/${question.id}/edit`, {
      method: 'POST',
      body: { ...questionBody(question), ...body },
    })
  )

export const deleteQuestion = (assessmentId: string, questionId: string) =>
  questionsChanged(
    assessmentId,
    assessmentRequest<void>(`/assessments/${assessmentId}/questions/${questionId}`, { method: 'DELETE' })
  )

/*
  Positions are unique, so two questions trade places through a free slot:
  the first moves past the end, the second takes its place, then the first
  takes the second's.
*/
export async function swapQuestions(
  assessmentId: string,
  first: AssessmentQuestion,
  second: AssessmentQuestion,
  free: number
) {
  const send = (question: AssessmentQuestion, position: number) =>
    assessmentRequest<AssessmentQuestion>(`/assessments/${assessmentId}/questions/${question.id}/edit`, {
      method: 'POST',
      body: { ...questionBody(question), position },
    })

  await questionsChanged(
    assessmentId,
    (async () => {
      await send(first, free)
      await send(second, first.position)
      await send(first, second.position)
    })()
  )
}

/*
  Test cases a question's answers run against. Input and expected output
  are kept as sent, whitespace included. Like questions, positions are
  unique per question but may have gaps: the order is what counts.
*/

export type TestcaseType = 'PUBLIC' | 'PRIVATE' | 'EVALUATION'

export const TESTCASE_TYPES: TestcaseType[] = ['PUBLIC', 'PRIVATE', 'EVALUATION']

export type Testcase = {
  id: string
  questionId: string
  position: number
  /** `null` when the type hides it from the signed-in student. */
  input: string | null
  expectedOutput: string | null
  timeLimitSeconds: number
  memoryLimitMB: number
  type: TestcaseType
  createdAt: string
  updatedAt: string
}

export type TestcaseBody = {
  input: string
  expectedOutput: string
  timeLimitSeconds: number
  memoryLimitMB: number
  type: TestcaseType
}

/** Only the fields sent change on every chosen test case. */
export type TestcaseBulkChange = Partial<Pick<TestcaseBody, 'timeLimitSeconds' | 'memoryLimitMB' | 'type'>>

export type TestcaseImport = Pick<TestcaseBody, 'timeLimitSeconds' | 'memoryLimitMB' | 'type'> & {
  /** One test case per line, matched line by line with `outputs`. */
  inputs: File
  outputs: File
}

export const testcaseKeys = {
  list: (assessmentId: string, questionId: string) =>
    [...questionKeys.list(assessmentId), questionId, 'testcases'] as const,
}

const testcasesPath = (assessmentId: string, questionId: string) =>
  `/assessments/${assessmentId}/questions/${questionId}/testcases`

export const testcasesQueryOptions = (assessmentId: string, questionId: string) =>
  queryOptions({
    queryKey: testcaseKeys.list(assessmentId, questionId),
    queryFn: ({ signal }) => assessmentRequest<Testcase[]>(testcasesPath(assessmentId, questionId), { signal }),
  })

async function testcasesChanged<T>(assessmentId: string, questionId: string, request: Promise<T>) {
  try {
    return await request
  } finally {
    await queryClient.invalidateQueries({ queryKey: testcaseKeys.list(assessmentId, questionId) })
  }
}

/** Appended after the last test case. */
export const createTestcase = (assessmentId: string, questionId: string, body: TestcaseBody) =>
  testcasesChanged(
    assessmentId,
    questionId,
    assessmentRequest<Testcase>(testcasesPath(assessmentId, questionId), { method: 'POST', body })
  )

/** Replaces every field; the position is kept. */
export const editTestcase = (assessmentId: string, testcase: Testcase, body: TestcaseBody) =>
  testcasesChanged(
    assessmentId,
    testcase.questionId,
    assessmentRequest<Testcase>(`${testcasesPath(assessmentId, testcase.questionId)}/${testcase.id}/edit`, {
      method: 'POST',
      body: { ...body, position: testcase.position },
    })
  )

export const bulkEditTestcases = (
  assessmentId: string,
  questionId: string,
  testcaseIds: string[],
  change: TestcaseBulkChange
) =>
  testcasesChanged(
    assessmentId,
    questionId,
    assessmentRequest<Testcase[]>(`${testcasesPath(assessmentId, questionId)}/bulk-edit`, {
      method: 'POST',
      body: { testCaseIds: testcaseIds, ...change },
    })
  )

export const deleteTestcases = (assessmentId: string, questionId: string, testcaseIds: string[]) =>
  testcasesChanged(
    assessmentId,
    questionId,
    assessmentRequest<void>(`${testcasesPath(assessmentId, questionId)}/bulk-delete`, {
      method: 'POST',
      body: testcaseIds,
    })
  )

export const importTestcases = (
  assessmentId: string,
  questionId: string,
  { inputs, outputs, ...body }: TestcaseImport
) => {
  const form = new FormData()
  form.append('body', new Blob([JSON.stringify(body)], { type: 'application/json' }))
  form.append('inputs', inputs)
  form.append('outputs', outputs)
  return testcasesChanged(
    assessmentId,
    questionId,
    assessmentRequest<Testcase[]>(`${testcasesPath(assessmentId, questionId)}/import`, { method: 'POST', body: form })
  )
}

/**
 * Sends the whole new order. The list is reordered in the cache first so a
 * drop lands at once, and put back by the refetch if the service refuses.
 */
export async function reorderTestcases(assessmentId: string, questionId: string, ordered: Testcase[]) {
  const key = testcaseKeys.list(assessmentId, questionId)
  await queryClient.cancelQueries({ queryKey: key })
  queryClient.setQueryData(key, ordered)
  return testcasesChanged(
    assessmentId,
    questionId,
    assessmentRequest<Testcase[]>(`${testcasesPath(assessmentId, questionId)}/reorder`, {
      method: 'POST',
      body: ordered.map((testcase) => testcase.id),
    })
  )
}
