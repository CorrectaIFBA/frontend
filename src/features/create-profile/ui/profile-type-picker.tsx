import { Check } from 'lucide-react'
import { PROFILE_KINDS, PROFILE_TONE } from '@/entities/profile'
import { PROFILE_TYPES, RING } from '@/features/create-profile/config/profile-types'
import type { ProfileType } from '@/shared/api/identity'
import { cn } from '@/shared/lib/cn'

/** Three cards, one per type, each in its profile's hue once chosen. */
export function ProfileTypePicker({
  value,
  onChange,
}: {
  value: ProfileType
  onChange: (value: ProfileType) => void
}) {
  return (
    <div aria-label="Tipo de perfil" className="grid grid-cols-3 gap-2" role="radiogroup">
      {PROFILE_TYPES.map((type) => {
        const kind = PROFILE_KINDS[type]
        const selected = type === value
        return (
          <button
            aria-checked={selected}
            className={cn(
              'relative flex cursor-pointer flex-col items-start gap-2.5 rounded-lg border p-3 text-left transition-colors',
              selected
                ? cn(PROFILE_TONE[type].ring, 'bg-card ring-1 ring-inset', RING[type])
                : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground'
            )}
            key={type}
            onClick={() => onChange(type)}
            role="radio"
            type="button"
          >
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-md transition-colors',
                selected ? PROFILE_TONE[type].solid : 'bg-muted'
              )}
            >
              <kind.icon className="size-3.5" />
            </span>
            <span className={cn('font-medium text-[13px]', selected && 'text-foreground')}>
              {kind.singular}
            </span>
            {selected ? (
              <Check className={cn('absolute top-3 right-3 size-3.5', PROFILE_TONE[type].text)} />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
