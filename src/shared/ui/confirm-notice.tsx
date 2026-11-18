import { CircleAlert, OctagonAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type ConfirmNoticeProps = {
  /** `irreversible`: the action cannot be undone. `attention`: a consequence worth reading first. */
  tone: 'irreversible' | 'attention'
  message?: ReactNode
}

const DEFAULT_MESSAGE = {
  irreversible: 'Esta ação não pode ser desfeita.',
  attention: null,
} as const

/** Callout inside a confirmation modal that flags what cannot be undone or needs attention. */
export function ConfirmNotice({ tone, message }: ConfirmNoticeProps) {
  const irreversible = tone === 'irreversible'
  const Icon = irreversible ? OctagonAlert : CircleAlert

  return (
    <div
      className={cn(
        'flex gap-2.5 rounded-md border px-3 py-2.5 text-xs leading-relaxed',
        irreversible ? 'border-destructive/30 bg-destructive/8' : 'border-warning/35 bg-warning/8'
      )}
      role="note"
    >
      <Icon
        aria-hidden
        className={cn('mt-px size-3.5 shrink-0', irreversible ? 'text-destructive' : 'text-warning')}
      />
      <p className="text-foreground/85">
        <strong className={cn('font-semibold', irreversible ? 'text-destructive' : 'text-warning')}>
          {irreversible ? 'Irreversível.' : 'Atenção.'}
        </strong>{' '}
        {message ?? DEFAULT_MESSAGE[tone]}
      </p>
    </div>
  )
}
