import { RulesForm } from '@/features/manage-assessment/ui/rules-form'
import { RulesList } from '@/features/manage-assessment/ui/rules-list'
import type { Assessment } from '@/shared/api/assessments'
import { Panel } from '@/shared/ui/panel'
import { PanelHeading } from '@/shared/ui/panel-heading'

/* ---------------------------------------------------------------------------
   Rules. Faculty change them in place; everyone else reads them as sentences.
--------------------------------------------------------------------------- */

export function RulesPanel({
  assessment,
  manageable,
  forStudent,
}: {
  assessment: Assessment
  manageable: boolean
  forStudent: boolean
}) {
  return (
    <Panel>
      <PanelHeading title="Regras" />
      {manageable ? <RulesForm assessment={assessment} /> : <RulesList assessment={assessment} forStudent={forStudent} />}
    </Panel>
  )
}
