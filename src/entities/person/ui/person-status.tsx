import { TONE } from '@/shared/config/state-tone'
import { StatusPill } from '@/shared/ui/status-pill'

export function PersonStatus({ active }: { active: boolean }) {
  return <StatusPill label={active ? 'Ativa' : 'Inativa'} tone={active ? TONE.ACTIVE : TONE.INACTIVE} />
}
