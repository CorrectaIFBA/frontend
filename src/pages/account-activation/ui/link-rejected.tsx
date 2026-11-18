import { Link } from '@tanstack/react-router'
import { LinkIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { buttonVariants } from '@/shared/ui/button'

export function LinkRejected({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-start gap-6">
      <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        <LinkIcon className="size-5" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-[-0.03em]">Este link não vale mais</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
        <p className="text-muted-foreground text-sm">
          Links de ativação expiram em 7 dias e valem uma vez. Se a conta já foi ativada, entre normalmente.
        </p>
      </div>
      <Link className={cn(buttonVariants({ variant: 'outline' }), 'h-9 w-full')} search={{}} to="/login">
        Ir para o login
      </Link>
    </div>
  )
}
