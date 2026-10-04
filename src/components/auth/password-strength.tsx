import { type Control, type FieldValues, type Path, useWatch } from 'react-hook-form'
import { cn } from '@/lib/utils'

/*
  A rough estimate, not a gate: the server only checks length. Length counts
  most, then variety of character classes — the two things that actually make
  a password expensive to guess.
*/
function score(password: string) {
  if (!password) return 0

  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) =>
    pattern.test(password)
  ).length

  let points = 0
  if (password.length >= 8) points++
  if (password.length >= 12) points++
  if (classes >= 3) points++
  if (password.length >= 16 || (password.length >= 12 && classes === 4)) points++

  return Math.max(points, 1)
}

const LEVELS = [
  { label: '', tone: '' },
  { label: 'Fraca', tone: 'bg-destructive' },
  { label: 'Razoável', tone: 'bg-warning' },
  { label: 'Boa', tone: 'bg-primary' },
  { label: 'Forte', tone: 'bg-success' },
]

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
