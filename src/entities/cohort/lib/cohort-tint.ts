import type { CSSProperties } from 'react'
import type { Cohort } from '@/shared/api/cohorts'

/* Hues kept apart from the teal accent so a cover never reads as a control. */
const HUES = [255, 285, 318, 350, 28, 62, 145, 222]

function cohortHue(id: string) {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return HUES[Math.abs(hash) % HUES.length]
}

/** Spread on the element that should carry the cohort's colour variables. */
export function cohortTint(cohort: Pick<Cohort, 'id' | 'status'>) {
  return {
    'data-cohort-hue': '',
    'data-cohort-state': cohort.status,
    style: { '--cohort-hue': cohortHue(cohort.id) } as CSSProperties,
  }
}
