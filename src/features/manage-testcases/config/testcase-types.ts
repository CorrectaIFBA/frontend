import { Eye, EyeOff, Lock } from 'lucide-react'
import type { TestcaseType } from '@/shared/api/assessments'

/* What each type lets the student see, in the words used across the panel. */
export const TYPE_INFO: Record<TestcaseType, { label: string; hint: string; icon: typeof Eye }> = {
  PUBLIC: { label: 'Público', hint: 'O estudante vê a entrada e a saída esperada.', icon: Eye },
  PRIVATE: { label: 'Privado', hint: 'O estudante sabe que existe, sem ver os valores.', icon: EyeOff },
  EVALUATION: { label: 'Avaliação', hint: 'Invisível ao estudante; só conta na correção.', icon: Lock },
}

export const DEFAULT_LIMITS = { timeLimitSeconds: 5, memoryLimitMB: 256 }
