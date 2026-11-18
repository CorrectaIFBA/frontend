import type { ComponentProps } from 'react'

export function SlugInputField(props: ComponentProps<'input'>) {
  return (
    <input
      className="h-full min-w-0 flex-1 bg-transparent pr-3 font-mono text-[13px] outline-none placeholder:text-muted-foreground/60"
      spellCheck={false}
      {...props}
    />
  )
}
