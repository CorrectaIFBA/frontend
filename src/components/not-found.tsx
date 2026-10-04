import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export function NotFound() {
  return (
    <main className="paper-grid flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-mono text-muted-foreground text-xs">
        <span className="text-destructive">404</span> · rota não encontrada
      </p>
      <h1 className="max-w-md text-balance font-semibold text-2xl">
        Essa página não existe — ou ainda não foi escrita.
      </h1>
      <Link className={buttonVariants({ variant: 'outline' })} to="/">
        Voltar ao início
      </Link>
    </main>
  )
}
