import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** A password field with a reveal toggle; typing a long password blind is error-prone. */
export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        className={cn('pr-9', className)}
        spellCheck={false}
        type={visible ? 'text' : 'password'}
        {...props}
      />
      <button
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setVisible((value) => !value)}
        tabIndex={-1}
        type="button"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
