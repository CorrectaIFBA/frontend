import { Link, useLocation } from '@tanstack/react-router'
import { memo } from 'react'
import type { NavGroup, NavItem } from '@/components/shell/nav-items'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

function isItemCurrent(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.url
  return pathname === item.url || pathname.startsWith(`${item.url}/`)
}

/* The current page is marked by a rule and full contrast, never by a hue. */
const menuButtonClassName = cn(
  'relative rounded-md text-sidebar-foreground/75',
  '[&>svg]:text-sidebar-foreground/45 [&>svg]:transition-colors',
  'hover:text-sidebar-foreground hover:[&>svg]:text-sidebar-foreground/75',
  'data-[current=true]:bg-sidebar-accent data-[current=true]:font-medium data-[current=true]:text-sidebar-accent-foreground',
  'data-[current=true]:[&>svg]:text-sidebar-primary',
  'data-[current=true]:before:absolute data-[current=true]:before:inset-y-1.5 data-[current=true]:before:left-0 data-[current=true]:before:w-0.5 data-[current=true]:before:rounded-full data-[current=true]:before:bg-sidebar-primary'
)

export function NavMain({ groups, topLevel }: { groups: NavGroup[]; topLevel: NavItem[] }) {
  return (
    <>
      <SidebarGroup className="px-2 py-1">
        <SidebarMenu className="gap-px">
          {topLevel.map((item) => (
            <NavRow item={item} key={item.url} />
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {groups.map((group) => (
        <SidebarGroup className="px-2 py-1" key={group.label}>
          <SidebarGroupLabel className="label-xs h-7 px-2 text-sidebar-foreground/40">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-px">
            {group.items.map((item) => (
              <NavRow item={item} key={item.url} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

const NavRow = memo(function NavRow({ item }: { item: NavItem }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const isCurrent = useLocation({
    select: (location) => isItemCurrent(location.pathname, item),
  })

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={menuButtonClassName}
        data-current={isCurrent}
        tooltip={item.title}
      >
        <Link onClick={() => isMobile && setOpenMobile(false)} to={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})
