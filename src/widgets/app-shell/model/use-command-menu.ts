import { useEffect, useState } from 'react'
import type { ProfileType } from '@/shared/api/identity'
import { navFor, type NavItem, topLevelFor } from '@/shared/config/navigation'

/* Open state, search text and the Ctrl+K and `/` shortcuts of the header search. */
export function useCommandMenu(profileType: ProfileType) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const pages: (NavItem & { group: string })[] = [
    ...topLevelFor(profileType).map((item) => ({ ...item, group: '' })),
    ...navFor(profileType).flatMap((group) => group.items.map((item) => ({ ...item, group: group.label }))),
  ]

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isTyping =
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(event.target.tagName))

      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      } else if (event.key === '/' && !isTyping) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function run(action: () => void) {
    setOpen(false)
    setSearch('')
    action()
  }

  return { open, setOpen, search, setSearch, pages, run }
}
