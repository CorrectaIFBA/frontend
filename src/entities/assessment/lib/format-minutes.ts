export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${minutes} min`
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}
