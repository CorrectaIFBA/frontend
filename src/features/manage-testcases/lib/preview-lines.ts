export const PREVIEW_LINES = 4

export function previewLines(value: string | null) {
  return (value ?? '').replace(/\n$/, '').split('\n')
}
