import { useIsFetching } from '@tanstack/react-query'
import { AccountMenu } from '@/components/shell/account-menu'
import { CommandMenu } from '@/components/shell/command-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import type { SelfAccountInfo } from '@/lib/api/identity'

export function AppHeader({ me }: { me: SelfAccountInfo }) {
  return (
    <header className="sticky top-0 z-20 shrink-0 border-border border-b bg-background/85 backdrop-blur-xl">
      <div className="flex h-13 items-center gap-3 px-3 sm:px-5">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <div className="flex min-w-0 flex-1 justify-center">
          <CommandMenu profileType={me.profile.type} />
        </div>
        <AccountMenu me={me} />
      </div>
      <FetchRule />
    </header>
  )
}

function FetchRule() {
  const fetching = useIsFetching()
  return <div aria-hidden className="fetch-rule" data-active={fetching > 0} />
}
