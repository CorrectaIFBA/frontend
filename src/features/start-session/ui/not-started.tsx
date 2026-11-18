import { LockKeyhole } from 'lucide-react'
import { formatGrade } from '@/entities/assessment'
import { useCohortView } from '@/entities/cohort'
import { startBlocker } from '@/features/start-session/lib/start-blocker'
import { StartDialog } from '@/features/start-session/ui/start-dialog'
import type { Assessment } from '@/shared/api/assessments'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

export function NotStarted({ assessment }: { assessment: Assessment }) {
  const { cohort } = useCohortView()
  const count = assessment.questionCount
  const blocked = startBlocker(assessment, cohort.status)

  return (
    <Panel>
      <PanelHeading title="Questões" />
      <div className="paper-grid flex flex-col items-center gap-2 px-6 py-12 text-center">
        <span className="mb-1 flex size-10 items-center justify-center rounded-lg border border-border bg-card text-(--cohort-ink)">
          <LockKeyhole className="size-[18px]" strokeWidth={1.75} />
        </span>
        <p className="font-medium text-[13px]">
          {count ? `${count === 1 ? 'Uma questão' : `${count} questões`}, valendo ${formatGrade(Number(assessment.totalGrade))}` : 'Questões'}
        </p>
        <p className="max-w-sm text-muted-foreground text-xs leading-relaxed">
          {blocked ?? 'Elas aparecem quando você iniciar. Iniciar não pode ser desfeito.'}
        </p>
        {blocked ? null : (
          <div className="mt-2">
            <StartDialog assessment={assessment} />
          </div>
        )}
      </div>
    </Panel>
  )
}
