import { ResultCount } from '@/shared/ui/result-count'

export function SectionHeading({ title, total, one, many }: { title: string; total?: number; one: string; many: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-semibold text-[13px]">{title}</h2>
      <ResultCount many={many} one={one} total={total} />
    </div>
  )
}
