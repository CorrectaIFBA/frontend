import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

export type IconActionProps = Omit<ComponentProps<'button'>, 'children'> & {
  label: string
  icon: ReactNode
  /** Turns the action off and says why in the tooltip. */
  disabledHint?: string
  tone?: 'default' | 'destructive'
}

/**
 * A row action as an icon with its name on hover. It passes the rest of its
 * props to the button, so dialog triggers can wrap it. A disabled action
 * keeps the tooltip, through a focusable wrapper, so it can say why.
 */
export function IconAction({ label, icon, disabledHint, tone = 'default', className, ...buttonProps }: IconActionProps) {
  const button = (
    <Button
      {...buttonProps}
      aria-label={label}
      className={cn(tone === 'destructive' && 'hover:text-destructive', className)}
      disabled={Boolean(disabledHint)}
      size="icon-sm"
      variant="ghost-muted"
    >
      {icon}
    </Button>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {disabledHint ? (
          <span className="inline-flex" tabIndex={0}>
            {button}
          </span>
        ) : (
          button
        )}
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        {disabledHint ?? label}
      </TooltipContent>
    </Tooltip>
  )
}
