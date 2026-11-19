import { Award, ClipboardCheck, Clock, Eye, EyeOff, Hourglass, type LucideIcon, SpellCheck, TimerOff } from 'lucide-react'
import { formatMinutes } from '@/entities/assessment/lib/format-minutes'
import type { AssessmentParameters } from '@/shared/api/assessments'

export type Rule = { icon: LucideIcon; label: string; detail: string }

/**
 * Every rule of the activity in plain words, for its page. Students are not
 * told whether late work is accepted or how grades and scoring are released (`forStudent`).
 */
export function describeRules(parameters: AssessmentParameters | null, forStudent: boolean): Rule[] {
  if (!parameters) return []
  const rules: Rule[] = []

  rules.push(
    parameters.maximumTimeAllowed
      ? {
        icon: Hourglass,
        label: formatMinutes(parameters.maximumTimeAllowed),
        detail: `Depois de começar, o estudante tem ${formatMinutes(parameters.maximumTimeAllowed)} para entregar.`,
      }
      : { icon: TimerOff, label: 'Sem limite de tempo', detail: 'Não haverá cronômetro depois do início da execução.' }
  )

  // The scoring waits for the grades; with the grades hidden it never shows.
  const waitsForGrades = parameters.canViewDefinitiveTestcaseScoringAfterSubmission && parameters.showTestcaseScoringOnlyAfterGrading
  const waitsForever = waitsForGrades && !parameters.showAssignedGrades

  rules.push(
    parameters.canViewDefinitiveTestcaseScoringAfterSubmission && !waitsForever
      ? {
        icon: Eye,
        label: 'Casos de teste visíveis',
        detail: 'A pontuação nos casos de teste aparecerá após a entrega.',
      }
      : {
        icon: EyeOff,
        label: 'Casos de teste ocultos',
        detail: waitsForever && !forStudent
          ? 'A pontuação nos casos de teste ainda não foi liberada.'
          : 'A pontuação nos casos de teste não será exibida.',
      }
  )

  rules.push(
    parameters.showCompilationErrors
      ? { icon: SpellCheck, label: 'Erros visíveis', detail: 'O editor destaca os erros de compilação enquanto o código é escrito.' }
      : { icon: SpellCheck, label: 'Erros apenas ao compilar', detail: 'Os erros de compilação só aparecem quando o código é executado.' }
  )

  if (forStudent) return rules

  if (waitsForGrades && !waitsForever) {
    rules.push({
      icon: ClipboardCheck,
      label: 'Pontuação após a nota',
      detail: 'A pontuação nos casos de teste aparecerá quando todas as questões forem avaliadas.',
    })
  }

  rules.push(
    parameters.showAssignedGrades
      ? { icon: Award, label: 'Notas visíveis', detail: 'As notas e os comentários aparecem para o estudante.' }
      : { icon: Award, label: 'Notas ocultas', detail: 'As notas e os comentários não aparecem para o estudante.' }
  )

  rules.push(
    parameters.canBeSubmittedAfterDueDate
      ? { icon: Clock, label: 'Aceita atraso', detail: 'Entregas após o encerramento do prazo ainda são aceitas.' }
      : { icon: Clock, label: 'Sem atraso', detail: 'Entregas fecham no prazo.' }
  )

  return rules
}
