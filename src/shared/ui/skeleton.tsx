import { cn } from '@/shared/lib/cn'

/**
 * A placeholder block. The bar a skeleton is made of: one step deeper than the
 * surfaces around it, so the light band that crosses it has something to
 * travel over (see `.skeleton-shimmer` in global.css).
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "skeleton-shimmer rounded-sm bg-foreground/10 dark:bg-foreground/10",
        className,
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
