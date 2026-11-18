import { Link, useLocation } from '@tanstack/react-router'
import { memo } from 'react'
import type { NavItem } from '@/shared/config/navigation'
import { cn } from '@/shared/lib/cn'
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shared/ui/sidebar'
import { isItemCurrent } from '@/widgets/app-shell/lib/is-item-current'

/* The current page is marked by a rule and full contrast, never by a hue. */
const menuButtonClassName = cn(
  'relative rounded-md text-sidebar-foreground/75',
  '[&>svg]:text-sidebar-foreground/45 [&>svg]:transition-colors',
  'hover:text-sidebar-foreground hover:[&>svg]:text-sidebar-foreground/75',
  'data-[current=true]:bg-sidebar-accent data-[current=true]:font-medium data-[current=true]:text-sidebar-accent-foreground',
  'data-[current=true]:[&>svg]:text-sidebar-primary',
  'data-[current=true]:before:absolute data-[current=true]:before:inset-y-1.5 data-[current=true]:before:left-0 data-[current=true]:before:w-0.5 data-[current=true]:before:rounded-full data-[current=true]:before:bg-sidebar-primary'
)

export const NavRow = memo(function NavRow({ item }: { item: NavItem }) {
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
