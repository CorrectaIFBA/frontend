import { queryOptions } from '@tanstack/react-query'
import { assessmentKeys, assessmentRequest } from '@/shared/api/assessments'
import { queryClient } from '@/shared/api/query-client'

/*
  Grades faculty give each question of a student's attempt, with a comment.
  The attempt's final grade is the mean of its question grades.

    GET  /assessments/{assessmentId}/results   (faculty: every student)
    GET  /assessments/{assessmentId}/students/{studentProfileId}/results
    GET  /assessments/{assessmentId}/students/{studentProfileId}/results/logs   (faculty)
    POST /assessments/{assessmentId}/questions/{questionId}/results/students/{studentProfileId}/grade   (faculty)

  A student reads their own grades only when the activity shows them.
*/

export type QuestionGrade = {
  id: string
  questionId: string
  studentProfileId: string
  /** `null` when the grade was cleared. */
  score: number | null
  comment: string | null
  gradedByProfileId: string | null
  gradedAt: string | null
  createdAt: string
  updatedAt: string
}

/** One saved version of a question grade. */
export type GradeLog = {
  id: string
  resultId: string
  questionId: string
  score: number | null
  comment: string | null
  updatedByProfileId: string | null
  createdAt: string
}

export type GradeBody = {
  score: number | null
  comment: string | null
}

const gradeKeys = {
  all: (assessmentId: string) => [...assessmentKeys.detail(assessmentId), 'grades'] as const,
  student: (assessmentId: string, studentProfileId: string) =>
    [...assessmentKeys.detail(assessmentId), 'grades', 'student', studentProfileId] as const,
}

/** Faculty only: every grade of every student, one entry per graded question. */
export const assessmentGradesQueryOptions = (assessmentId: string) =>
  queryOptions({
    queryKey: [...gradeKeys.all(assessmentId), 'every-student'],
    queryFn: ({ signal }) =>
      assessmentRequest<QuestionGrade[]>(`/assessments/${encodeURIComponent(assessmentId)}/results`, { signal }),
  })

const studentPath = (assessmentId: string, studentProfileId: string) =>
  `/assessments/${encodeURIComponent(assessmentId)}/students/${encodeURIComponent(studentProfileId)}/results`

export const studentGradesQueryOptions = (assessmentId: string, studentProfileId: string) =>
  queryOptions({
    queryKey: [...gradeKeys.student(assessmentId, studentProfileId), 'current'],
    queryFn: ({ signal }) => assessmentRequest<QuestionGrade[]>(studentPath(assessmentId, studentProfileId), { signal }),
  })

/** Newest first, every question together. */
export const studentGradeLogsQueryOptions = (assessmentId: string, studentProfileId: string) =>
  queryOptions({
    queryKey: [...gradeKeys.student(assessmentId, studentProfileId), 'logs'],
    queryFn: ({ signal }) => assessmentRequest<GradeLog[]>(`${studentPath(assessmentId, studentProfileId)}/logs`, { signal }),
  })

/** Creates the question's grade on the first call and replaces it afterwards; every call is logged. */
export async function gradeQuestion(assessmentId: string, questionId: string, studentProfileId: string, body: GradeBody) {
  const grade = await assessmentRequest<QuestionGrade>(
    `/assessments/${encodeURIComponent(assessmentId)}/questions/${encodeURIComponent(questionId)}/results/students/${encodeURIComponent(studentProfileId)}/grade`,
    { method: 'POST', body }
  )

  await queryClient.invalidateQueries({ queryKey: gradeKeys.all(assessmentId) })

  return grade
}
