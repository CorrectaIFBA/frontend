import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/shared/lib/cn'

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[0.5rem] border font-medium text-[13px] leading-none transition-[background-color,border-color,color,box-shadow,scale] duration-150 [&:active:not([aria-haspopup])]:scale-[0.97] disabled:pointer-events-none disabled:opacity-64 aria-disabled:pointer-events-none aria-disabled:opacity-64 aria-invalid:border-destructive [&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "control-filled text-(--button-primary-foreground)",
        destructive:
          "control-filled text-white [--control-fill:var(--button-destructive)]",
        "destructive-outline":
          "control-raised text-destructive hover:border-destructive/32",
        outline: "control-raised text-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
        ghost:
          "border-transparent text-foreground hover:bg-accent data-[state=open]:bg-accent",
        "ghost-muted":
          "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground",
        link: "border-transparent text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground",
      },
      size: {
        default: "h-8 px-[calc(--spacing(3)-1px)]",
        sm: "h-7 gap-1.5 px-[calc(--spacing(2.5)-1px)]",
        lg: "h-9 px-[calc(--spacing(3.5)-1px)]",
        xs: "h-6 gap-1 rounded-[0.4375rem] px-[calc(--spacing(2)-1px)] text-xs [&_svg:not([class*='size-'])]:size-3.5",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
        "icon-xs": "size-6 rounded-[0.4375rem] [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
    />
  )
}

export { Button, buttonVariants }
