import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-sm border transition-colors [&>svg]:pointer-events-none [&>svg]:size-3 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary px-1.5 py-0.5 text-[11px] font-medium tracking-tight text-primary-foreground [a&]:hover:bg-primary/85",
        secondary:
          "border-transparent bg-secondary px-1.5 py-0.5 text-[11px] font-medium tracking-tight text-secondary-foreground [a&]:hover:bg-accent",
        destructive:
          "border-transparent bg-destructive px-1.5 py-0.5 text-[11px] font-medium tracking-tight text-white [a&]:hover:bg-destructive/85",
        outline:
          "border-border px-1.5 py-0.5 text-[11px] font-medium tracking-tight text-foreground [a&]:hover:bg-accent",
        /**
         * Data tag — the micro register used for short enum-like values
         * (game, mode, team). Uppercase so it reads as a token, not prose.
         */
        tag: "label-xs border-border px-1.5 py-1 text-muted-foreground [a&]:hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
