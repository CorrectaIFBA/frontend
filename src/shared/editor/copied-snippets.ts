/*
  Text copied or cut inside a code editor during this page session. A paste
  into an editor that blocks outside code is allowed only for these texts, so
  the check no longer depends on what the editor happens to contain.
*/
const snippets = new Set<string>()

export function normalizeSnippet(text: string) {
  return text.replace(/\r\n/g, '\n').trim()
}

export function rememberSnippet(text: string) {
  const snippet = normalizeSnippet(text)

  if (snippet) snippets.add(snippet)
}

export function isCopiedSnippet(text: string) {
  const snippet = normalizeSnippet(text)

  return Boolean(snippet) && snippets.has(snippet)
}
