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
      : { icon: TimerOff, label: 'Sem limite de tempo', detail: 'Não há cronômetro depois de começar.' }
  )

  // The scoring waits for the grades; with the grades hidden it never shows.
  const waitsForGrades = parameters.canViewDefinitiveTestcaseScoringAfterSubmission && parameters.showTestcaseScoringOnlyAfterGrading
  const waitsForever = waitsForGrades && !parameters.showAssignedGrades

  rules.push(
    parameters.canViewDefinitiveTestcaseScoringAfterSubmission && !waitsForever
      ? {
          icon: Eye,
          label: 'Casos de teste visíveis',
          detail: 'A pontuação nos casos de teste definitivos aparece depois da entrega.',
        }
      : {
          icon: EyeOff,
          label: 'Casos de teste ocultos',
          detail: waitsForever && !forStudent
            ? 'A pontuação nos casos de teste só apareceria com as notas, e as notas estão ocultas.'
            : 'A pontuação nos casos de teste definitivos não aparece depois da entrega.',
        }
  )

  rules.push(
    parameters.showCompilationErrors
      ? { icon: SpellCheck, label: 'Erros visíveis', detail: 'O editor sublinha os erros de compilação enquanto o código é escrito.' }
      : { icon: SpellCheck, label: 'Erros só na entrega', detail: 'Os erros de compilação só aparecem quando o código é enviado.' }
  )

  if (forStudent) return rules

  if (waitsForGrades && !waitsForever) {
    rules.push({
      icon: ClipboardCheck,
      label: 'Pontuação após a nota',
      detail: 'A pontuação nos casos de teste aparece quando todas as questões tiverem nota.',
    })
  }

  rules.push(
    parameters.showAssignedGrades
      ? { icon: Award, label: 'Notas visíveis', detail: 'As notas e os comentários dos docentes aparecem para o estudante.' }
      : { icon: Award, label: 'Notas ocultas', detail: 'As notas e os comentários dos docentes não aparecem para o estudante.' }
  )

  rules.push(
    parameters.canBeSubmittedAfterDueDate
      ? { icon: Clock, label: 'Aceita atraso', detail: 'Entregas depois do prazo ainda são aceitas.' }
      : { icon: Clock, label: 'Sem atraso', detail: 'Entregas fecham no prazo.' }
  )

  return rules
}
