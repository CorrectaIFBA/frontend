import { Check, CircleDashed, LoaderCircle, Minus, TriangleAlert, X } from 'lucide-react'
import type { TestCaseResultStatus } from '@/shared/api/evaluations'

/* ---------------------------------------------------------------------------
   Results of the student's last run, live from the evaluation orchestrator.
   One short verdict per test case; the output only for public ones. Every
   change of a verdict animates, so each event of the run is seen arriving.
--------------------------------------------------------------------------- */

type Tone = 'muted' | 'success' | 'destructive' | 'warning'

export const STATUS_INFO: Record<TestCaseResultStatus, { label: string; tone: Tone; icon: typeof Check }> = {
  PENDING: { label: 'Aguardando', tone: 'muted', icon: CircleDashed },
  RUNNING: { label: 'Executando', tone: 'muted', icon: LoaderCircle },
  PASSED: { label: 'Passou', tone: 'success', icon: Check },
  WRONG_ANSWER: { label: 'Resposta incorreta', tone: 'destructive', icon: X },
  COMPILATION_ERROR: { label: 'Erro de compilação', tone: 'destructive', icon: X },
  RUNTIME_ERROR: { label: 'Erro de execução', tone: 'destructive', icon: TriangleAlert },
  TIME_LIMIT_EXCEEDED: { label: 'Tempo excedido', tone: 'warning', icon: TriangleAlert },
  MEMORY_LIMIT_EXCEEDED: { label: 'Memória excedida', tone: 'warning', icon: TriangleAlert },
  INTERNAL_ERROR: { label: 'Erro interno', tone: 'warning', icon: TriangleAlert },
  SKIPPED: { label: 'Não executado', tone: 'muted', icon: Minus },
}

export const TEXT_TONE: Record<Tone, string> = {
  muted: 'text-muted-foreground',
  success: 'text-success',
  destructive: 'text-destructive',
  warning: 'text-warning',
}

export const FILL_TONE: Record<Tone, string> = {
  muted: 'bg-muted-foreground/40',
  success: 'bg-success',
  destructive: 'bg-destructive',
  warning: 'bg-warning',
}

/**
 * A lasting tint of the verdict behind a whole test case, with a solid stripe
 * on its left edge, so passed and failed read apart at a glance.
 */
export const WASH_TONE: Record<Tone, string> = {
  muted: '',
  success: 'bg-success/14 shadow-[inset_3px_0_0_var(--color-success)]',
  destructive: 'bg-destructive/14 shadow-[inset_3px_0_0_var(--color-destructive)]',
  warning: 'bg-warning/16 shadow-[inset_3px_0_0_var(--color-warning)]',
}

export const statusTone = (status: TestCaseResultStatus) => STATUS_INFO[status].tone
