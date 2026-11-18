import { type UIEvent, useEffect, useRef, useState } from 'react'
import type { SettingsTab } from '@/shared/lib/shell-dialogs'
import { ALL_TABS, TAB_GROUPS } from '@/widgets/app-shell/config/settings-tabs'

/* The open tab, the search over tabs and the heading being read in the settings dialog. */
export function useSettingsNavigation(initialTab: SettingsTab) {
  const [tab, setTab] = useState<SettingsTab>(initialTab)
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const current = ALL_TABS.find((definition) => definition.id === tab) ?? ALL_TABS[0]
  const term = query.trim().toLowerCase()

  const groups = TAB_GROUPS.map((group) => ({
    ...group,
    tabs: group.tabs.filter(
      (definition) =>
        !term ||
        [definition.title, ...definition.keywords, ...(definition.sections ?? []).map((section) => section.title)]
          .join(' ')
          .toLowerCase()
          .includes(term)
    ),
  })).filter((group) => group.tabs.length > 0)

  function selectTab(next: SettingsTab) {
    setTab(next)
    scrollRef.current?.scrollTo({ top: 0 })
  }

  // Lights up the heading being read, as the content scrolls.
  useEffect(() => {
    const root = scrollRef.current
    const sections = current.sections

    if (!(root && sections)) {
      setActiveSection(null)

      return
    }

    setActiveSection(sections[0].id)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)

        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { root, rootMargin: '0px 0px -70% 0px' }
    )

    for (const section of sections) {
      const element = root.querySelector(`#${section.id}`)

      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [current])

  function goToSection(id: string) {
    setActiveSection(id)
    scrollRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // The last heading may never reach the top; at the bottom it is the one being read.
  function onContentScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget
    const sections = current.sections

    if (sections && element.scrollTop + element.clientHeight >= element.scrollHeight - 4) {
      setActiveSection(sections[sections.length - 1].id)
    }
  }

  return { tab, current, groups, query, setQuery, activeSection, scrollRef, selectTab, goToSection, onContentScroll }
}
