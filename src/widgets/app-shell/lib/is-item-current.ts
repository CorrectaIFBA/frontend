import type { NavItem } from '@/shared/config/navigation'

export function isItemCurrent(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.url
  return pathname === item.url || pathname.startsWith(`${item.url}/`)
}
