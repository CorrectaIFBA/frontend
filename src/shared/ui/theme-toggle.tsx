import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/shared/lib/theme-provider'
import { Button } from '@/shared/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <Button
      aria-label={next === 'dark' ? 'Usar tema escuro' : 'Usar tema claro'}
      onClick={() => setTheme(next)}
      size="icon-sm"
      variant="ghost-muted"
    >
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
