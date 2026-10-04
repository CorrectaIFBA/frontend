import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & { size?: "sm" | "default" }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-[calc(--spacing(3)-1px)] py-1 text-base transition-colors md:text-[13px]",
        "placeholder:text-muted-foreground/70 hover:border-border-strong",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:border-destructive",
        size === "sm" && "h-7 px-[calc(--spacing(2.5)-1px)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
