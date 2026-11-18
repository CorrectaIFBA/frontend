const relativeFormat = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

/** “há 3 dias”, “ontem”; past a month the plain date says more. */
export function relativeDate(iso: string) {
  const days = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000)
  if (days > -1) return 'hoje'
  if (days > -30) return relativeFormat.format(days, 'day')
  return dateFormat.format(new Date(iso))
}

export const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
