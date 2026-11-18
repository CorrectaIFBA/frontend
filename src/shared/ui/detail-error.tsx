import { CircleAlert } from 'lucide-react'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import { PageContent } from '@/shared/ui/page-content'

export function DetailError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <PageContent className="items-center justify-center text-center">
      <CircleAlert className="size-5 text-muted-foreground" />
      <p className="font-medium text-sm">Não foi possível carregar</p>
      <p className="max-w-sm text-muted-foreground text-xs">{errorMessage(error)}</p>
      <Button onClick={onRetry} size="sm" variant="outline">
        Tentar novamente
      </Button>
    </PageContent>
  )
}
