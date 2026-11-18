import type { FieldPath } from 'react-hook-form'
import type { RulesValues } from '@/features/manage-assessment/model/assessment-schema'

type Toggle = Exclude<FieldPath<RulesValues>, 'timeLimit'>

export const TOGGLES: { name: Toggle; label: string; hint: string; dependsOn?: Toggle }[] = [
  {
    name: 'showCompilationErrors',
    label: 'Mostrar erros de compilação',
    hint: 'Sublinha os erros no editor durante a escrita.',
  },
  {
    name: 'canBeSubmittedAfterDueDate',
    label: 'Aceitar entregas atrasadas',
    hint: 'Entregas continuam abertas depois do prazo.',
  },
  {
    name: 'canViewDefinitiveTestcaseScoringAfterSubmission',
    label: 'Mostrar casos de teste definitivos',
    hint: 'O estudante vê a pontuação nos casos de teste depois de entregar.',
  },
  {
    name: 'showTestcaseScoringOnlyAfterGrading',
    label: 'Exibir pontuação de casos de teste apenas após atribuição de nota',
    hint: 'A pontuação só aparece quando todas as questões do estudante tiverem nota. Com as notas ocultas, ela não aparece.',
    dependsOn: 'canViewDefinitiveTestcaseScoringAfterSubmission',
  },
  {
    name: 'showAssignedGrades',
    label: 'Exibir notas definidas',
    hint: 'O estudante vê as notas e os comentários que os docentes deram.',
  },
]
