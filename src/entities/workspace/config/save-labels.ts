import type { SyncSnapshot } from '@/entities/workspace/model/draft-syncer'

/* ---------------------------------------------------------------------------
   Where the code stands, in the editor's toolbar. A dot and a few words:
   the student glances at it, so each state says one thing.
--------------------------------------------------------------------------- */

export const SAVE_LABEL: Record<SyncSnapshot['state'], (snapshot: SyncSnapshot) => string> = {
  idle: () => 'Ainda não salvo',
  dirty: () => 'Alterações não salvas',
  saving: () => 'Salvando…',
  saved: ({ revision }) => `Salvo na revisão ${revision}`,
  offline: () => 'Sem conexão; o código fica neste navegador',
  conflict: () => 'Versão diferente em outra janela',
  locked: () => 'Somente leitura',
  error: () => 'Não foi possível salvar',
}

export const DOT_TONE: Record<SyncSnapshot['state'], string> = {
  idle: 'bg-transparent ring-1 ring-border-strong ring-inset',
  dirty: 'bg-transparent ring-[1.5px] ring-(--cohort-ink) ring-inset',
  saving: 'bg-(--cohort-ink) animate-pulse motion-reduce:animate-none',
  saved: 'bg-(--cohort-ink)',
  offline: 'bg-warning',
  conflict: 'bg-warning',
  locked: 'bg-muted-foreground',
  error: 'bg-destructive',
}
