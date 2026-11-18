import { useRouterState } from '@tanstack/react-router'

export function RouteProgress() {
  const pending = useRouterState({ select: (state) => state.status === 'pending' })

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden opacity-0 transition-opacity data-[pending=true]:opacity-100 data-[pending=true]:delay-150"
      data-pending={pending}
    >
      <div className="h-full w-1/3 animate-route-progress bg-primary" />
    </div>
  )
}
