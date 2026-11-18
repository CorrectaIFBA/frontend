import type { NavGroup, NavItem } from '@/shared/config/navigation'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/shared/ui/sidebar'
import { NavRow } from '@/widgets/app-shell/ui/nav-row'

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
