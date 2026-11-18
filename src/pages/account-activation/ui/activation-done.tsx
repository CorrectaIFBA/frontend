import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { AnimatedCheck } from '@/shared/ui/animated-check'
import { buttonVariants } from '@/shared/ui/button'

export function ActivationDone() {
  return (
    <div className="flex flex-col items-start gap-6">
      <AnimatedCheck />
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-[-0.03em]">Conta ativada</h1>
        <p className="text-muted-foreground text-sm">
          Entre com o login do e-mail de ativação e a nova senha.
        </p>
      </div>
      <Link
        className={cn(buttonVariants(), 'h-9 w-full')}
        replace
        search={{}}
        to="/login"
      >
        Ir para o login
        <ArrowRight />
      </Link>
    </div>
  )
}
