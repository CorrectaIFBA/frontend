import { FolderCode } from 'lucide-react'
import { IconAction } from '@/pages/activity-sessions/ui/icon-action'

/** The way to the student's submitted code; the whole finished row opens it too. Without `onOpen`, nothing was submitted yet. */
export function WorkspaceAction({ onOpen }: { onOpen?: () => void }) {
  return (
    <IconAction
      disabledHint={onOpen ? undefined : 'Ver o envio: disponível quando a tentativa terminar'}
      icon={<FolderCode />}
      label="Ver o envio"
      onClick={onOpen}
    />
  )
}
