import { cn } from '@/shared/lib/cn'

export function Signature({ label, value, tone }: { label: string; value: string; tone: 'bad' | 'plain' }) {
  return (
    <>
      <dt className="font-sans text-muted-foreground text-xs">{label}</dt>
      <dd className={cn('m-0 min-w-0 truncate', tone === 'bad' && 'text-foreground')} title={value}>
        {value}
      </dd>
    </>
  )
}
