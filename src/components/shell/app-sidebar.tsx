import { Link } from '@tanstack/react-router'
import { LogoMark } from '@/components/brand'
import { NavMain } from '@/components/shell/nav-main'
import { OVERVIEW_ITEM, navFor } from '@/components/shell/nav-items'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import type { ProfileType } from '@/lib/api/identity'

export function AppSidebar({ profileType }: { profileType: ProfileType }) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-11 rounded-md" size="lg">
              <Link to="/">
                <LogoMark />
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-[15px] tracking-[-0.03em]">
                    correcta
                  </span>
                  <span className="label-xs mt-0.5 truncate text-sidebar-foreground/40">
                    Painel da instituição
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1 py-1">
        <NavMain groups={navFor(profileType)} topLevel={[OVERVIEW_ITEM]} />
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <p className="font-mono text-[10px] text-sidebar-foreground/35">
          IFBA · juiz online · v0.1
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
