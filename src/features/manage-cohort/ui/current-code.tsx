import { Copy, Link2 } from 'lucide-react'
import { joinLink } from '@/entities/cohort'
import { spacedCode } from '@/features/manage-cohort/lib/spaced-code'
import type { InvitationCode } from '@/shared/api/cohorts'
import { copy } from '@/shared/lib/copy'
import { dateTimeFormat, relativeDate } from '@/shared/lib/date-format'
import { Button } from '@/shared/ui/button'

export function CurrentCode({ code }: { code: InvitationCode }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
      <code className="select-all rounded-md border border-border bg-card px-3 py-3 text-center font-mono font-semibold text-(--cohort-ink) text-[22px] tracking-[0.18em]">
        {spacedCode(code.code)}
      </code>
      <p className="text-muted-foreground text-xs">
        Vale até {dateTimeFormat.format(new Date(code.expiresAt))}. Gerado {relativeDate(code.createdAt)}.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => copy(code.code, 'Código')} size="sm" variant="outline">
          <Copy /> Copiar código
        </Button>
        <Button onClick={() => copy(joinLink(code.code), 'Link')} size="sm" variant="outline">
          <Link2 /> Copiar link
        </Button>
      </div>
    </div>
  )
}
