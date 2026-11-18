/** Digits only, the form the identity service stores and compares. */
export function normalizeCpf(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
}

/** 12345678901 → 123.456.789-01, formatting as much as has been typed. */
export function formatCpf(value: string) {
  const digits = normalizeCpf(value)
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')
}

/** The same check digits the service validates, so a bad number fails here first. */
export function isValidCpf(value: string) {
  const digits = normalizeCpf(value)
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const checkDigit = (length: number) => {
    let sum = 0
    for (let index = 0; index < length; index++) {
      sum += Number(digits[index]) * (length + 1 - index)
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return checkDigit(9) === Number(digits[9]) && checkDigit(10) === Number(digits[10])
}
