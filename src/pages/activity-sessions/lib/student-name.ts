import type { RosterEntry } from '@/shared/api/sessions'

export function studentName(entry: RosterEntry) {
  return entry.displayName ?? 'Perfil indisponível'
}
