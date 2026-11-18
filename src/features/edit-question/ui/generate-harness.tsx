import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { generateHarness } from '@/shared/lib/c-harness'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

/** Builds a harness from the draft's function; asks before replacing one that is already written. */
export function GenerateHarness({
  current,
  draft,
  onGenerate,
}: {
  current: string
  draft: string
  onGenerate: (code: string) => void
}) {
  const generated = generateHarness(draft)
  if (!generated) {
    return (
      <Button disabled size="xs" title="Defina no código inicial a função que o estudante escreve." type="button" variant="ghost-muted">
        <Sparkles /> Gerar do código
      </Button>
    )
  }
  const trigger = (
    <Button size="xs" type="button" variant="ghost-muted">
      <Sparkles /> Gerar do código
    </Button>
  )
  if (!current.trim()) {
    return (
      <Button
        onClick={() => {
          onGenerate(generated.code)
          toast.success('Harness gerado.')
        }}
        size="xs"
        type="button"
        variant="ghost-muted"
      >
        <Sparkles /> Gerar do código
      </Button>
    )
  }
  return (
    <ConfirmDialog
      action={async () => onGenerate(generated.code)}
      confirmLabel="Gerar"
      description={`O harness é gerado a partir de ${generated.fn.name}.`}
      notice={{ tone: 'attention', message: 'O harness atual é substituído no editor.' }}
      successMessage="Harness gerado."
      title="Gerar o harness do código?"
      trigger={trigger}
    />
  )
}
