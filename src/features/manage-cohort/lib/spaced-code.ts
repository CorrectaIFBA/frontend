/** Split in two halves so it can be read aloud in class; the service accepts it either way. */
export function spacedCode(code: string) {
  return code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code
}
