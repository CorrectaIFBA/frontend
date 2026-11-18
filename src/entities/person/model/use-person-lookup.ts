import { useQuery } from '@tanstack/react-query'
import { directoryKeys, findPersonByDocument } from '@/shared/api/directory'
import { isValidCpf, normalizeCpf } from '@/shared/lib/cpf'

/**
 * Who a CPF already belongs to. Runs only for a complete, valid number, so
 * the answer is either a person, nobody, or still being asked.
 */
export function usePersonLookup(documentNumber: string) {
  const digits = normalizeCpf(documentNumber)
  const enabled = isValidCpf(digits)

  const query = useQuery({
    queryKey: [...directoryKeys.persons, 'by-document', digits],
    queryFn: ({ signal }) => findPersonByDocument(digits, signal),
    enabled,
    staleTime: 0,
  })

  return {
    enabled,
    checking: enabled && query.isFetching,
    person: enabled ? query.data : undefined,
    isError: query.isError,
  }
}
