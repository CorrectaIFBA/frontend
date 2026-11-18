import { Input } from '@/shared/ui/input'

export function CreatedBetween({
  from,
  to,
  onChange,
}: {
  from?: string
  to?: string
  onChange: (range: { from?: string; to?: string }) => void
}) {
  const field = 'h-8 w-[8.5rem] bg-card px-2 text-xs text-foreground [color-scheme:light] dark:[color-scheme:dark]'

  return (
    <fieldset className="flex items-center gap-1.5 text-muted-foreground text-xs">
      <legend className="sr-only">Data de criação</legend>
      <span>Criadas de</span>
      <Input
        aria-label="Criadas a partir de"
        className={field}
        max={to}
        onChange={(event) => onChange({ from: event.target.value || undefined, to })}
        type="date"
        value={from ?? ''}
      />
      <span>até</span>
      <Input
        aria-label="Criadas até"
        className={field}
        min={from}
        onChange={(event) => onChange({ from, to: event.target.value || undefined })}
        type="date"
        value={to ?? ''}
      />
    </fieldset>
  )
}
