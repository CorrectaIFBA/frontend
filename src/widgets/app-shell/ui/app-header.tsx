import { Link } from '@tanstack/react-router'
import type { SelfAccountInfo } from '@/shared/api/identity'
import { LogoMark } from '@/shared/ui/logo-mark'
import { SidebarTrigger } from '@/shared/ui/sidebar'
import { AccountMenu } from '@/widgets/app-shell/ui/account-menu'
import { CommandMenu } from '@/widgets/app-shell/ui/command-menu'
import { FetchRule } from '@/widgets/app-shell/ui/fetch-rule'

export function AppHeader({ me }: { me: SelfAccountInfo }) {
  return (
    <header className="sticky top-0 z-20 shrink-0 border-border border-b bg-background/85 backdrop-blur-xl">
      <div className="flex h-13 items-center gap-3 px-3 sm:px-5">
        {/* Students have no sidebar: the mark leads home instead. */}
        {me.profile.type === 'STUDENT' ? (
          <Link aria-label="Turmas" className="flex shrink-0 items-center gap-2 rounded-md" to="/">
            <LogoMark className="size-6" />
            <span className="hidden font-semibold text-[15px] tracking-[-0.03em] sm:inline">correcta</span>
          </Link>
        ) : (
          <SidebarTrigger className="-ml-1 shrink-0" />
        )}
        <div className="flex min-w-0 flex-1 justify-center">
          <CommandMenu profileType={me.profile.type} />
        </div>
        <AccountMenu me={me} />
      </div>
      <FetchRule />
    </header>
  )
}
