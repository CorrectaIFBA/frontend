import { useNavigate } from '@tanstack/react-router'
import { Command as CommandPrimitive } from 'cmdk'
import { CornerDownLeft, MonitorSmartphone, Moon, Search, Settings, Sun, UserPlus } from 'lucide-react'
import type { ProfileType } from '@/shared/api/identity'
import { shellDialogs } from '@/shared/lib/shell-dialogs'
import { useTheme } from '@/shared/lib/theme-provider'
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog'
import { useCommandMenu } from '@/widgets/app-shell/model/use-command-menu'

const itemClassName =
  'flex h-10 cursor-pointer select-none items-center gap-3 rounded-md px-2.5 text-[13px] text-muted-foreground outline-none data-[selected=true]:bg-accent data-[selected=true]:text-foreground [&_svg]:size-4 [&_svg]:shrink-0'

const groupClassName =
  'px-1.5 pb-1.5 [&_[cmdk-group-heading]]:label-xs [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-muted-foreground'

type CommandMenuProps = {
  profileType: ProfileType
}

/** The header search: pages and quick actions. */
export function CommandMenu({ profileType }: CommandMenuProps) {
  const { open, setOpen, search, setSearch, pages, run } = useCommandMenu(profileType)
  const navigate = useNavigate()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <>
      <button
        className="group flex h-8 w-full max-w-md cursor-pointer items-center gap-2.5 rounded-md border border-input bg-muted/40 px-2.5 text-left text-muted-foreground transition-colors hover:border-border-strong hover:bg-muted/70"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 truncate text-[13px]">Buscar páginas e ações…</span>
        <kbd className="hidden items-center gap-0.5 rounded-sm border border-border bg-background px-1.5 font-mono text-[10px] sm:inline-flex">
          Ctrl K
        </kbd>
      </button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent
          className="top-[18%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Buscar</DialogTitle>
          <CommandPrimitive loop>
            <div className="flex items-center gap-2.5 border-border border-b px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <CommandPrimitive.Input
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onValueChange={setSearch}
                placeholder="Para onde você quer ir?"
                value={search}
              />
            </div>
            <CommandPrimitive.List className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain">
              <CommandPrimitive.Empty className="px-4 py-10 text-center text-muted-foreground text-xs">
                Nada encontrado para “{search}”.
              </CommandPrimitive.Empty>

              <CommandPrimitive.Group className={groupClassName} heading="Páginas">
                {pages.map((page) => (
                  <CommandPrimitive.Item
                    className={itemClassName}
                    key={page.url}
                    keywords={[page.group, page.description]}
                    onSelect={() => run(() => navigate({ to: page.url }))}
                    value={page.title}
                  >
                    <page.icon />
                    <span className="text-foreground">{page.title}</span>
                    {page.group ? (
                      <span className="ml-auto text-muted-foreground text-xs">{page.group}</span>
                    ) : null}
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>

              <CommandPrimitive.Group className={groupClassName} heading="Ações">
                <CommandPrimitive.Item
                  className={itemClassName}
                  onSelect={() =>
                    run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))
                  }
                  value="Alternar tema claro escuro"
                >
                  {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
                  <span className="text-foreground">
                    Usar tema {resolvedTheme === 'dark' ? 'claro' : 'escuro'}
                  </span>
                </CommandPrimitive.Item>
                <CommandPrimitive.Item
                  className={itemClassName}
                  onSelect={() => run(() => shellDialogs.addAccount())}
                  value="Adicionar outra conta"
                >
                  <UserPlus />
                  <span className="text-foreground">Adicionar outra conta</span>
                </CommandPrimitive.Item>
                <CommandPrimitive.Item
                  className={itemClassName}
                  keywords={['dispositivos', 'encerrar']}
                  onSelect={() => run(() => shellDialogs.settings('sessions'))}
                  value="Sessões"
                >
                  <MonitorSmartphone />
                  <span className="text-foreground">Sessões</span>
                </CommandPrimitive.Item>
                <CommandPrimitive.Item
                  className={itemClassName}
                  keywords={['preferências', 'notificações', 'tema']}
                  onSelect={() => run(() => shellDialogs.settings())}
                  value="Configurações"
                >
                  <Settings />
                  <span className="text-foreground">Configurações</span>
                </CommandPrimitive.Item>
              </CommandPrimitive.Group>
            </CommandPrimitive.List>
            <div className="flex items-center gap-1.5 border-border border-t px-4 py-2 text-[11px] text-muted-foreground">
              <CornerDownLeft className="size-3" /> abrir
              <span className="ml-3 font-mono">esc</span> fechar
            </div>
          </CommandPrimitive>
        </DialogContent>
      </Dialog>
    </>
  )
}
