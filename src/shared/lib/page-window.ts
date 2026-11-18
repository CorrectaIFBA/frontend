/** Page numbers around the current one, with gaps where the run is cut. */
export function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const pages = new Set([1, total, current - 1, current, current + 1])
  if (current <= 3) for (const page of [2, 3, 4]) pages.add(page)
  if (current >= total - 2) for (const page of [total - 3, total - 2, total - 1]) pages.add(page)

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((first, second) => first - second)
  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? (['gap', page] as const) : [page]
  )
}
