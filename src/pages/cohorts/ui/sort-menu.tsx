import { ArrowDownUp } from 'lucide-react'
import { SORTS } from '@/pages/cohorts/model/cohort-list-search'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

type SortOption = (typeof SORTS)[number]

type SortMenuProps = {
  sort: SortOption
  onSelect: (option: SortOption) => void
}

export function SortMenu({ sort, onSelect }: SortMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-muted-foreground" size="sm" variant="ghost-muted">
          <ArrowDownUp /> {sort.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuRadioGroup
          onValueChange={(id) => {
            const option = SORTS.find((candidate) => candidate.id === id)

            if (option) onSelect(option)
          }}
          value={sort.id}
        >
          {SORTS.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
