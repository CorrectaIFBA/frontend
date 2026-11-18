/*
  A rough estimate, not a gate: the server only checks length. Length counts
  most, then variety of character classes — the two things that actually make
  a password expensive to guess.
*/
export function score(password: string) {
  if (!password) return 0

  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) =>
    pattern.test(password)
  ).length

  let points = 0
  if (password.length >= 8) points++
  if (password.length >= 12) points++
  if (classes >= 3) points++
  if (password.length >= 16 || (password.length >= 12 && classes === 4)) points++

  return Math.max(points, 1)
}

export const LEVELS = [
  { label: '', tone: '' },
  { label: 'Fraca', tone: 'bg-destructive' },
  { label: 'Razoável', tone: 'bg-warning' },
  { label: 'Boa', tone: 'bg-primary' },
  { label: 'Forte', tone: 'bg-success' },
]
