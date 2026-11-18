/** Reads a grade typed with a comma or a dot. `null` for an empty field, `NaN` for anything that is not a number. */
export function parseScore(text: string) {
  const trimmed = text.trim().replace(',', '.')

  if (!trimmed) return null
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return Number.NaN

  return Number(trimmed)
}
