import { Play } from 'lucide-react'
import { useCohortView } from '@/entities/cohort'
import { changeCohortStatus, type CohortState } from '@/shared/api/cohorts'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import type { ConfirmNoticeProps } from '@/shared/ui/confirm-notice'

export function StatusAction({
  target,
  label,
  title,
  description,
  success,
  icon: Icon,
  destructive,
  notice,
}: {
  target: CohortState
  label: string
  title: string
  description: string
  success: string
  icon: typeof Play
  destructive?: boolean
  notice?: ConfirmNoticeProps
}) {
  const { cohort } = useCohortView()

  return (
    <ConfirmDialog
      action={() => changeCohortStatus(cohort.id, target)}
      confirmLabel={label}
      description={description}
      destructive={destructive}
      notice={notice}
      successMessage={success}
      title={title}
      trigger={
        <Button size="sm" variant={destructive ? 'destructive-outline' : 'default'}>
          <Icon /> {label}
        </Button>
      }
    />
  )
}
