import { type Control, type FieldValues, type Path, useWatch } from 'react-hook-form'
import { cn } from '@/shared/lib/cn'
import { LEVELS, score } from '@/shared/lib/password-score'

export function PasswordStrength<T extends FieldValues>({
  control,
  name = 'password' as Path<T>,
}: {
  control: Control<T>
  name?: Path<T>
}) {
  const password = (useWatch({ control, name }) as string | undefined) ?? ''
  const level = score(password)

  return (
    <div aria-live="polite" className="flex items-center gap-3">
      <div className="grid flex-1 grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <span
            className={cn(
              'h-1 rounded-full bg-border transition-colors duration-300',
              level >= segment && LEVELS[level].tone
            )}
            key={segment}
          />
        ))}
      </div>
      <span className="w-14 text-right text-[11px] text-muted-foreground">{LEVELS[level].label}</span>
    </div>
  )
}
