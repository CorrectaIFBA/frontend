import { MAX_CODE_LENGTH } from '@/shared/api/workspaces'
import { cn } from '@/shared/lib/cn'

/** Shown only near the limit: the service refuses code over 65,536 characters. */
export function LengthCounter({ length }: { length: number }) {
  if (length < MAX_CODE_LENGTH * 0.9) return null
  const over = length > MAX_CODE_LENGTH
  return (
    <span className={cn('text-xs tabular-nums', over ? 'font-medium text-destructive' : 'text-warning')}>
      {length.toLocaleString('pt-BR')} de {MAX_CODE_LENGTH.toLocaleString('pt-BR')} caracteres
    </span>
  )
}
