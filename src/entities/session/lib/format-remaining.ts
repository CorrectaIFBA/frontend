export const URGENT_MS = 5 * 60_000

/** `1 h 20 min` while there is time, `04:59` in the last hour. */
export function formatRemaining(ms: number) {
  const seconds = Math.ceil(ms / 1000)
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return minutes ? `${hours} h ${minutes} min` : `${hours} h`
  }
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}
