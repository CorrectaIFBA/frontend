import type { RosterEntry } from '@/shared/api/sessions'
import type { useRosterTable } from '@/pages/activity-sessions/model/use-roster-tables'
import type { Column } from '@/shared/ui/data-table-column'
import { DataTable } from '@/shared/ui/data-table'
import { ResultCount } from '@/shared/ui/result-count'

export type RosterSectionProps = {
  title: string
  description: string
  table: ReturnType<typeof useRosterTable>
  columns: Column<RosterEntry>[]
  emptyTitle: string
  emptyHint?: string
  onRowClick?: (entry: RosterEntry) => void
}

export function RosterSection({ title, description, table, columns, emptyTitle, emptyHint, onRowClick }: RosterSectionProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-[13px]">{title}</h3>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        <ResultCount many="estudantes" one="estudante" total={table.query.data?.totalElements} />
      </div>
      <DataTable
        columns={columns}
        dir={table.dir}
        emptyHint={emptyHint}
        emptyTitle={emptyTitle}
        onPage={table.onPage}
        onRowClick={onRowClick}
        onSort={table.onSort}
        query={table.query}
        rowKey={(entry) => entry.studentProfileId}
        sort={table.sort}
      />
    </section>
  )
}
