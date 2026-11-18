import { Controller, useForm } from 'react-hook-form'
import { cn } from '@/shared/lib/cn'
import { Input } from '@/shared/ui/input'

type LimitValues = { timeLimitSeconds: string; memoryLimitMB: string }

export function LimitFields<T extends LimitValues>({
  form: formOfValues,
  placeholder,
}: {
  form: ReturnType<typeof useForm<T>>
  placeholder?: string
}) {
  // react-hook-form cannot narrow generic paths; these names are guaranteed by T.
  const form = formOfValues as unknown as ReturnType<typeof useForm<LimitValues>>
  const fields = [
    { name: 'timeLimitSeconds', label: 'Tempo limite', unit: 's', hint: '1 a 60' },
    { name: 'memoryLimitMB', label: 'Memória limite', unit: 'MB', hint: '16 a 1024' },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map((item) => (
        <Controller
          control={form.control}
          key={item.name}
          name={item.name}
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1.5">
              <span className="font-medium text-sm">{item.label}</span>
              <span className="flex items-center gap-2">
                <Input
                  aria-invalid={Boolean(fieldState.error)}
                  className="h-9 text-right tabular-nums"
                  inputMode="numeric"
                  placeholder={placeholder ?? item.hint}
                  {...field}
                />
                <span className="text-muted-foreground text-xs">{item.unit}</span>
              </span>
              <span className={cn('text-xs', fieldState.error ? 'text-destructive' : 'text-muted-foreground')}>
                {fieldState.error?.message ?? item.hint}
              </span>
            </label>
          )}
        />
      ))}
    </div>
  )
}
