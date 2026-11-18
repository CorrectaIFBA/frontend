import type { SelfAccountInfo } from '@/shared/api/identity'
import { shellDialogs, useShellDialog } from '@/shared/lib/shell-dialogs'
import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { AddAccount } from '@/widgets/app-shell/ui/add-account'
import { SettingsDialog } from '@/widgets/app-shell/ui/settings-dialog'

/** Mounted once in the app shell; renders whichever dialog is open. */
export function ShellDialogs({ me }: { me: SelfAccountInfo }) {
  const state = useShellDialog()

  return (
    <>
      <Dialog
        onOpenChange={(open) => !open && shellDialogs.close()}
        open={state?.dialog === 'add-account'}
      >
        <DialogContent className="grid max-h-[calc(100svh-2rem)] gap-0 overflow-hidden p-0 sm:max-w-[min(960px,calc(100%-2rem))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <AddAccount />
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(open) => !open && shellDialogs.close()}
        open={state?.dialog === 'settings'}
      >
        <DialogContent
          className="h-[min(760px,calc(100svh-2rem))] max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-[min(1080px,calc(100%-2rem))]"
          onOpenAutoFocus={(event) => event.preventDefault()}
          showCloseButton={false}
        >
          {state?.dialog === 'settings' ? <SettingsDialog me={me} tab={state.tab} /> : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
