import { toast } from 'sonner'
import { LoginForm } from '@/features/sign-in'
import { shellDialogs } from '@/shared/lib/shell-dialogs'
import { DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { JudgePanel } from '@/shared/ui/judge-panel'
import { Wordmark } from '@/shared/ui/wordmark'

/** The login screen, brought into a dialog: same form, same judge beside it. */
export function AddAccount() {
  return (
    <>
      <div className="flex min-w-0 flex-col gap-8 overflow-y-auto px-8 py-8 sm:px-10">
        <Wordmark />

        <div className="flex flex-col gap-2">
          <DialogTitle className="font-semibold text-2xl tracking-[-0.03em]">
            Adicionar outra conta
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Troque de conta pelo menu do perfil, sem digitar a senha de novo.
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
