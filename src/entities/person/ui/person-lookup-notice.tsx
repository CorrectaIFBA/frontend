import { LoaderCircle, UserRoundPlus } from 'lucide-react'
import { usePersonLookup } from '@/entities/person/model/use-person-lookup'
import { LinkedPerson } from '@/entities/person/ui/linked-person'
import { Notice } from '@/entities/person/ui/lookup-notice'

/** The association the form is about to make, stated before it is made. */
export function PersonLookupNotice({
  lookup,
  existingHint,
  newHint,
}: {
  lookup: ReturnType<typeof usePersonLookup>
  existingHint: string
  newHint: string
}) {
  if (!lookup.enabled) return null

  if (lookup.checking) {
    return (
      <Notice icon={<LoaderCircle className="size-4 animate-spin" />}>
        <span className="text-muted-foreground">Procurando pessoa com este CPF…</span>
      </Notice>
    )
  }

  if (lookup.isError) {
    return (
      <Notice icon={<UserRoundPlus className="size-4" />}>
        <span className="text-muted-foreground">
          Não foi possível verificar o CPF agora. O servidor confere ao salvar.
        </span>
      </Notice>
    )
  }

  if (lookup.person) return <LinkedPerson hint={existingHint} person={lookup.person} />

  return (
    <Notice icon={<UserRoundPlus className="size-4" />}>
      <span className="text-muted-foreground">{newHint}</span>
    </Notice>
  )
}
