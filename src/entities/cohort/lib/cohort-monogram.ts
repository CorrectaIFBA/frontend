const MINOR_WORDS = new Set(['a', 'o', 'e', 'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'para', 'com'])

/** “Estruturas de Dados” → ED: the first letters of the words that carry the name. */
export function cohortMonogram(name: string) {
  const words = name.split(/\s+/).filter((word) => word && !MINOR_WORDS.has(word.toLowerCase()))
  const letters = words.slice(0, 2).map((word) => word[0])
  return (letters.join('') || name.slice(0, 2)).toUpperCase()
}
