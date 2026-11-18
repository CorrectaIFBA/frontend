import { useQuery } from '@tanstack/react-query'
import { useCohortView } from '@/entities/cohort'
import { questionsQueryOptions } from '@/shared/api/assessments'
import { cohortFacultyQueryOptions } from '@/shared/api/cohorts'
import { studentGradeLogsQueryOptions, studentGradesQueryOptions } from '@/shared/api/grades'
import { studentResultSummariesQueryOptions } from '@/shared/api/submission-results'

/**
 * Everything the grading sheet reads for one student: the questions, their grades and history, the share of test
 * cases each question passed, and the names of the cohort's faculty, who sign the grades.
 */
export function useGradeSheetData(assessmentId: string, studentProfileId: string, isOpen: boolean) {
  const { cohort } = useCohortView()
  const enabled = isOpen && Boolean(studentProfileId)
  const questions = useQuery({ ...questionsQueryOptions(assessmentId), enabled })
  const grades = useQuery({ ...studentGradesQueryOptions(assessmentId, studentProfileId), enabled })
  const logs = useQuery({ ...studentGradeLogsQueryOptions(assessmentId, studentProfileId), enabled })
  const summaries = useQuery({ ...studentResultSummariesQueryOptions(assessmentId), enabled })
  const faculty = useQuery({ ...cohortFacultyQueryOptions(cohort.id), enabled })

  const gradesByQuestionId = new Map(grades.data?.map((grade) => [grade.questionId, grade]))
  const summary = summaries.data?.find((entry) => entry.studentProfileId === studentProfileId)
  const testcaseScoresByQuestionId = new Map(summary?.questions?.map((question) => [question.questionId, question]))
  const facultyNamesById = new Map(
    faculty.data?.content.map((member) => [member.profileId, member.displayName ?? 'Docente'])
  )

  return {
    questions: questions.data,
    logs: logs.data,
    gradesByQuestionId,
    testcaseScoresByQuestionId,
    /** Whether the test case summary is still loading; without it each question says so. */
    isTestcaseScoreLoading: summaries.isPending,
    graderName: (profileId: string | null) => (profileId ? (facultyNamesById.get(profileId) ?? 'Docente') : 'Docente'),
    error: questions.error ?? grades.error,
    logsError: logs.error,
  }
}
