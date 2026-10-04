import { useNavigate } from '@tanstack/react-router'
import {
  Check,
  ChevronDown,
  LogOut,
  Monitor,
  MonitorSmartphone,
  Moon,
  Plus,
  Settings,
  Sun,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AccountAvatar } from '@/components/shell/account-avatar'
import { PROFILE_LABEL } from '@/components/shell/nav-items'
import { shellDialogs } from '@/components/shell/shell-dialogs'
import { useTheme } from '@/components/theme/theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SelfAccountInfo } from '@/lib/api/identity'
import { signOut, signOutEverywhere, switchAccount } from '@/lib/auth/session'
import { useAccounts } from '@/lib/auth/use-accounts'

/**
 * Who you are, top right. Every account signed in on this browser is listed
 * here, so moving between a staff and a faculty login is one click.
 */
export function AccountMenu({ me }: { me: SelfAccountInfo }) {
  const navigate = useNavigate()
  const { accounts, active } = useAccounts()
  const { theme, setTheme } = useTheme()
  const [busy, setBusy] = useState(false)

  const others = accounts.filter((account) => account.id !== active?.id)

  function handleSwitch(accountId: string, name: string) {
    switchAccount(accountId)
    navigate({ to: '/' })
    toast(`Agora você está como ${name.split(' ')[0]}.`)
  }

  async function handleSignOut(everywhere: boolean) {
    if (!active) return
    setBusy(true)
    try {
      if (everywhere) {
        await signOutEverywhere()
      } else {
        await signOut(active.id)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menu da conta"
        className="group flex h-9 cursor-pointer items-center gap-2 rounded-md py-1 pr-1.5 pl-1 outline-none transition-colors hover:bg-accent data-[state=open]:bg-accent"
        disabled={busy}
      >
        <AccountAvatar name={me.person.displayName} />
        <span className="hidden min-w-0 flex-col text-left leading-tight sm:flex">
          <span className="max-w-40 truncate font-medium text-[13px]">{me.person.displayName}</span>
          <span className="truncate text-[11px] text-muted-foreground">
            {PROFILE_LABEL[me.profile.type]}
          </span>
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72" sideOffset={6}>
        <div className="flex items-center gap-3 px-2 py-2.5">
          <AccountAvatar className="size-9" name={me.person.displayName} />
          <div className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate font-medium text-[13px]">{me.person.displayName}</span>
            <span className="truncate text-muted-foreground text-xs">{me.account.email}</span>
          </div>
          <span className="label-xs rounded-sm bg-primary/12 px-1.5 py-1 text-primary">
            {PROFILE_LABEL[me.profile.type]}
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="label-xs py-2 text-muted-foreground">
          Contas neste navegador
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {active ? (
            <div aria-current="true" className="flex items-center gap-2.5 rounded-sm bg-accent/60 px-2 py-1.5 text-sm">
              <AccountAvatar className="size-6" name={active.displayName} />
              <span className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate text-foreground">{active.displayName}</span>
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {active.login}
                </span>
              </span>
              <Check className="size-4 text-primary" />
            </div>
          ) : null}
          {others.map((account) => (
            <DropdownMenuItem
              className="gap-2.5"
              key={account.id}
              onSelect={() => handleSwitch(account.id, account.displayName)}
            >
              <AccountAvatar className="size-6" name={account.displayName} />
              <span className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate">{account.displayName}</span>
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {account.login} · {PROFILE_LABEL[account.profileType]}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onSelect={() => shellDialogs.addAccount()}>
            <span className="flex size-6 items-center justify-center rounded-md border border-border-strong border-dashed">
                <Plus className="size-3.5" />
              </span>
            Adicionar outra conta
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => shellDialogs.settings('sessions')}>
          <MonitorSmartphone />
          Sessões
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => shellDialogs.settings()}>
          <Settings />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            {theme === 'dark' ? (
              <Moon className="size-4" />
            ) : theme === 'light' ? (
              <Sun className="size-4" />
            ) : (
              <Monitor className="size-4" />
            )}
            Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              onValueChange={(value) => setTheme(value as 'dark' | 'light' | 'system')}
              value={theme}
            >
              <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">Seguir o sistema</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => handleSignOut(false)}>
          <LogOut />
          Sair desta conta
        </DropdownMenuItem>
        {others.length > 0 ? (
          <DropdownMenuItem onSelect={() => handleSignOut(true)} variant="destructive">
            <LogOut />
            Sair de todas as contas
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
