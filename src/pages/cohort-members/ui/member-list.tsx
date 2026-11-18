import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from '@tanstack/react-query'
import { useCohortView } from '@/entities/cohort'
import { useMemberColumns } from '@/pages/cohort-members/model/use-member-columns'
import { SectionHeading } from '@/pages/cohort-members/ui/section-heading'
import { cohortFacultyQueryOptions, cohortMembersQueryOptions } from '@/shared/api/cohorts'
import { toPagination } from '@/shared/lib/list-search'
import { DataTable } from '@/shared/ui/data-table'

const route = getRouteApi('/_app/classes/$cohortRef/members')

/*
  Faculty first, then students. The service sorts members only by when they
  joined, so the two roles come from separate reads: the faculty list, and
  the member list with its faculty rows left out.
*/
export function MemberList() {
  const { cohort } = useCohortView()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const pagination = toPagination(search, 'joinedAt')
  const faculty = useQuery(cohortFacultyQueryOptions(cohort.id))
  const facultyCount = faculty.data?.totalElements ?? 0
  const students = useQuery({
    ...cohortMembersQueryOptions(cohort.id, pagination),
    select: (page) => ({
      ...page,
      content: page.content.filter((member) => member.role === 'STUDENT'),
      totalElements: Math.max(page.totalElements - facultyCount, 0),
    }),
  })
  const columns = useMemberColumns()

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <SectionHeading many="docentes" one="docente" title="Docentes" total={faculty.data?.totalElements} />
        <DataTable
          columns={columns}
          dir="asc"
          emptyTitle="Nenhum docente"
          onPage={() => {}}
          onSort={() => {}}
          query={faculty}
          rowKey={(member) => member.profileId}
          sort="joinedAt"
        />
      </section>
      <section className="flex flex-col gap-3">
        <SectionHeading
          many="estudantes"
          one="estudante"
          title="Estudantes"
          total={students.data && faculty.data ? students.data.totalElements : undefined}
        />
        <DataTable
          columns={columns.map((column) => (column.id === 'joinedAt' ? { ...column, sortKey: 'joinedAt' } : column))}
          dir={pagination.sortDirection}
          emptyHint="Compartilhe o código da turma ou convide estudantes em Gerenciar."
          emptyTitle="Nenhum estudante ainda"
          onPage={(page) => navigate({ search: (previous) => ({ ...previous, page }) })}
          onSort={(sort, dir) => navigate({ search: (previous) => ({ ...previous, sort, dir, page: undefined }) })}
          query={students}
          rowKey={(member) => member.profileId}
          sort={pagination.sortBy}
        />
      </section>
    </div>
  )
}
