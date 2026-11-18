import { HEADLINES } from '@/shared/config/judge-demo'

/* One line per visit, kept while the tab lives so screens don't swap it. */
export function pickHeadline() {
  try {
    const kept = Number(sessionStorage.getItem('correcta.headline'))
    if (Number.isInteger(kept) && kept >= 0 && kept < HEADLINES.length) {
      return HEADLINES[kept]
    }
    const index = Math.floor(Math.random() * HEADLINES.length)
    sessionStorage.setItem('correcta.headline', String(index))
    return HEADLINES[index]
  } catch {
    return HEADLINES[0]
  }
}
