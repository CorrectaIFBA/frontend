import { WifiOff } from 'lucide-react'
import { useSolve } from '@/widgets/solve/model/solve-context'

/* ---------------------------------------------------------------------------
   States that stop the student: no connection, the end.
--------------------------------------------------------------------------- */

/*
  Shown as soon as beats stop getting through. The session stays open, and
  the code keeps being saved in this browser.
*/
export function ConnectionStrip() {
  const { coding } = useSolve()
  const { connection, session } = coding
  const offline = connection.status === 'offline'
  if (!offline || session.state !== 'IN_PROGRESS') return null

  return (
    <div
      className="flex shrink-0 items-center gap-2.5 border-warning/30 border-b bg-warning/10 px-4 py-2 text-[13px]"
      role="alert"
    >
      <WifiOff className="size-4 shrink-0 text-warning" />
      <p className="min-w-0 flex-1">
        <span className="font-medium">Sem conexão.</span>{' '}
A atividade continua aberta, mas o tempo não para.{' '}
        <span className="text-muted-foreground">Seu código continua salvo neste navegador.</span>
      </p>
    </div>
  )
}
