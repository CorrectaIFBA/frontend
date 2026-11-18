import { PanelNote } from '@/shared/ui/panel-note'
import { SolveScreen } from '@/widgets/solve'

export function ReviewNotice({ message }: { message: string }) {
  return (
    <SolveScreen>
      <div className="m-auto w-full max-w-md p-4">
        <PanelNote>{message}</PanelNote>
      </div>
    </SolveScreen>
  )
}
