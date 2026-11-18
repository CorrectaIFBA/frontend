import type { SessionEventType } from '@/shared/api/sessions'

export const EVENT_LABEL: Record<SessionEventType, string> = {
  STARTED: 'Iniciou a atividade',
  RESUMED: 'Abriu a página da atividade',
  SUBMITTED: 'Entregou',
  EXPIRED: 'O tempo acabou',
  CLOSED_BY_ARCHIVE: 'Encerrada ao arquivar a atividade',
  CLOSED_BY_FACULTY: 'Encerrada por um docente',
  REOPENED: 'Reaberta por um docente',
  EXTENDED: 'Tempo estendido por um docente',
}

export const timeOfDay = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
