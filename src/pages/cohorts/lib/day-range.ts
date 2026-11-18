/** Calendar days in the viewer's zone, as the instants the service filters on. */
export function dayStart(day: string) {
  return new Date(`${day}T00:00:00`).toISOString()
}

export function dayEnd(day: string) {
  return new Date(`${day}T23:59:59.999`).toISOString()
}
