import { ChevronsDownUp, ChevronsUpDown, ListChecks, PanelRightClose } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { OpenCasesState } from '@/widgets/solve/model/use-open-cases'

type TestcaseColumnHeaderProps = {
  /** `undefined` while the test cases load. */
  count: number | undefined
  openCases: OpenCasesState
  onFold: () => void
}

export function TestcaseColumnHeader({ count, openCases, onFold }: TestcaseColumnHeaderProps) {
  const toggleAllLabel = openCases.hasOpen ? 'Recolher todos' : 'Expandir todos'

  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-border border-b px-3 text-xs">
      <ListChecks className="size-4 text-muted-foreground" />
      <span className="font-semibold text-[13px]">Casos de teste</span>
      {count !== undefined ? <span className="text-muted-foreground">{count}</span> : null}
      <Button
        aria-label={toggleAllLabel}
        className="ml-auto"
        disabled={!openCases.canToggleAll}
        onClick={openCases.toggleAll}
        size="xs"
        title={openCases.hasOpen ? 'Recolher todos os casos de teste' : 'Expandir todos os casos de teste'}
        variant="ghost-muted"
      >
        {openCases.hasOpen ? <ChevronsDownUp /> : <ChevronsUpDown />}
        <span className="hidden @xs:inline">{toggleAllLabel}</span>
      </Button>
      <Button
        aria-label="Ocultar casos de teste"
        onClick={onFold}
        size="icon-xs"
        title="Ocultar casos de teste"
        variant="ghost-muted"
      >
        <PanelRightClose />
      </Button>
    </div>
  )
}
