export function lineCount(code: string) {
  return code ? code.replace(/\n$/, '').split('\n').length : 0
}
