import { cn } from '@/shared/lib/cn'

/* A miniature of the shell in each theme, so the choice is seen, not read. */
export function ThemePreview({ variant }: { variant: 'light' | 'dark' | 'system' }) {
  const pane = (dark: boolean) => (
    <div className={cn('flex h-full flex-1 gap-1 p-1.5', dark ? 'bg-[#141a1a]' : 'bg-[#f6f8f8]')}>
      <div className={cn('w-1/4 rounded-[3px]', dark ? 'bg-white/8' : 'bg-black/6')} />
      <div className="flex flex-1 flex-col gap-1">
        <div className={cn('h-1.5 w-2/3 rounded-full', dark ? 'bg-white/20' : 'bg-black/15')} />
        <div className={cn('h-1.5 w-1/2 rounded-full', dark ? 'bg-white/10' : 'bg-black/8')} />
        <div className="mt-auto h-2 w-1/3 rounded-[2px] bg-primary/80" />
      </div>
    </div>
  )

  return (
    <div className="flex h-16 overflow-hidden rounded-md border border-border">
      {variant === 'system' ? (
        <>
          {pane(false)}
          {pane(true)}
        </>
      ) : (
        pane(variant === 'dark')
      )}
    </div>
  )
}
