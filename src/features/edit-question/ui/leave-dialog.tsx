import type { QuestionEditorState } from '@/features/edit-question/model/use-question-editor'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'

type LeaveDialogProps = {
  blocker: QuestionEditorState['blocker']
}

export function LeaveDialog({ blocker }: LeaveDialogProps) {
  return (
    <Dialog open={blocker.status === 'blocked'} onOpenChange={(open) => (open ? null : blocker.reset?.())}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="font-semibold text-[15px]">Sair sem salvar?</DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
          As mudanças não salvas serão perdidas.
        </DialogDescription>
        <div className="flex justify-end gap-2">
          <Button onClick={() => blocker.reset?.()} type="button" variant="outline">
            Continuar editando
          </Button>
          <Button onClick={() => blocker.proceed?.()} type="button" variant="destructive">
            Sair sem salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
