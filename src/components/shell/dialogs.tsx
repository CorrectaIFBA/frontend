import { toast } from 'sonner'
import { JudgePanel } from '@/components/auth/judge-panel'
import { LoginForm } from '@/components/auth/login-form'
import { Wordmark } from '@/components/brand'
import { SettingsDialog } from '@/components/shell/settings-dialog'
import { shellDialogs, useShellDialog } from '@/components/shell/shell-dialogs'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { SelfAccountInfo } from '@/lib/api/identity'

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

/** The login screen, brought into a dialog: same form, same judge beside it. */
function AddAccount() {
  return (
    <>
      <div className="flex min-w-0 flex-col gap-8 overflow-y-auto px-8 py-8 sm:px-10">
        <Wordmark />

        <div className="flex flex-col gap-2">
          <DialogTitle className="font-semibold text-2xl tracking-[-0.03em]">
            Adicionar outra conta
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            As contas ficam conectadas neste navegador. Troque entre elas pelo menu do seu perfil,
            sem digitar a senha de novo.
          </DialogDescription>
        </div>

        <LoginForm
          onSuccess={(me) => {
            shellDialogs.close()
            toast.success(`Conta de ${me.person.firstName} adicionada e ativa.`)
          }}
          submitLabel="Adicionar conta"
        />

        <p className="border-border border-t pt-5 text-muted-foreground text-xs leading-relaxed">
          <span className="font-medium text-foreground">Primeiro acesso?</span> Ative a conta pelo
          link enviado ao e-mail institucional antes de adicioná-la aqui.
        </p>
      </div>

      <JudgePanel className="m-2 ml-0 hidden rounded-xl lg:flex" compact />
    </>
  )
}
