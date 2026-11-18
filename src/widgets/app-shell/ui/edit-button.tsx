import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/button'
import { unavailable } from '@/widgets/app-shell/lib/unavailable'

export function EditButton({ children = 'Editar' }: { children?: ReactNode }) {
  return (
    <Button className="w-20 shrink-0" onClick={unavailable} size="sm" variant="outline">
      {children}
    </Button>
  )
}
