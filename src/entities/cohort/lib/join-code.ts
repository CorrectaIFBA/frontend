/** A shared link works as well as the bare code: keep what follows `/join/`. */
export function codeFromInput(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/\/join\/([^/?#\s]+)/)
  return match ? decodeURIComponent(match[1]) : trimmed
}

export function joinLink(code: string) {
  return `${window.location.origin}/classes/join/${encodeURIComponent(code)}`
}
