import { type ErrorComponentProps, useRouter } from '@tanstack/react-router'
import { WifiOff } from 'lucide-react'
import { errorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'

export function ShellError({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="paper-grid flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
        <WifiOff className="size-5" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-semibold text-lg">Não foi possível carregar o painel</h1>
        <p className="max-w-sm text-muted-foreground text-sm">{errorMessage(error)}</p>
      </div>
      <Button onClick={() => router.invalidate()} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}
