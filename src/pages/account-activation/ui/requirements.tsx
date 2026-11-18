import { Check } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { type ActivationValues, MAX_LENGTH, MIN_LENGTH } from '@/pages/account-activation/model/activation-schema'
import { cn } from '@/shared/lib/cn'

/** The rules the server enforces, ticked off as they are met. */
export function Requirements({ control }: { control: ReturnType<typeof useForm<ActivationValues>>['control'] }) {
  const [password, confirmPassword] = useWatch({
    control,
    name: ['password', 'confirmPassword'],
  })

  const rules = [
    {
      label: `Entre ${MIN_LENGTH} e ${MAX_LENGTH} caracteres`,
      met: password.length >= MIN_LENGTH && password.length <= MAX_LENGTH,
    },
    { label: 'As duas senhas coincidem', met: password.length > 0 && password === confirmPassword },
  ]

  return (
    <ul className="flex flex-col gap-1.5">
      {rules.map((rule) => (
        <li
          className={cn(
            'flex items-center gap-2 text-xs transition-colors',
            rule.met ? 'text-foreground' : 'text-muted-foreground'
          )}
          key={rule.label}
        >
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded-full border transition-colors',
              rule.met ? 'border-success bg-success text-white' : 'border-border-strong'
            )}
          >
            {rule.met ? <Check className="size-2.5" strokeWidth={3.5} /> : null}
          </span>
          {rule.label}
        </li>
      ))}
    </ul>
  )
}
