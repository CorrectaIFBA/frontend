export type ReviewSearch = { question?: string }

/** The open question travels in the URL, so a link or a reload lands on it. */
export function parseReviewSearch(search: Record<string, unknown>): ReviewSearch {
  return typeof search.question === 'string' && search.question ? { question: search.question } : {}
}
