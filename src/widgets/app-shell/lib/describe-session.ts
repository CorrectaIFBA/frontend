import { Monitor, Smartphone } from 'lucide-react'
import type { AccountSession } from '@/shared/api/identity'

/* ---------------------------------------------------------------------------
   Tabs
--------------------------------------------------------------------------- */

const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const relativeTimeFormat = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

export function describeLastSeen(lastSeenAt: string | null) {
  if (!lastSeenAt) return 'Sem atividade registrada'

  const minutes = Math.round((new Date(lastSeenAt).getTime() - Date.now()) / 60_000)
  if (minutes > -2) return 'Ativo agora'
  if (minutes > -60) return `Visto ${relativeTimeFormat.format(minutes, 'minute')}`

  const hours = Math.round(minutes / 60)
  if (hours > -24) return `Visto ${relativeTimeFormat.format(hours, 'hour')}`

  return `Visto em ${dateTimeFormat.format(new Date(lastSeenAt))}`
}

export function describeSession(session: AccountSession) {
  const browser = session.browser ?? 'Navegador'
  const system = session.operatingSystem ?? 'sistema desconhecido'
  const place =
    [session.city, session.region, session.countryCode].filter(Boolean).join(', ') ||
    session.ipAddress ||
    'Local desconhecido'
  const mobile = /phone|mobile|tablet/i.test(session.deviceType ?? '')

  return {
    label: `${browser} no ${system}`,
    place: session.deviceName ? `${session.deviceName} · ${place}` : place,
    icon: mobile ? Smartphone : Monitor,
  }
}
