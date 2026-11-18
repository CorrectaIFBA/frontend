export function maskEmail(email: string) {
  const [user, domain] = email.split('@')
  if (!domain) return email
  return `${'*'.repeat(Math.max(user.length, 3))}@${domain}`
}
