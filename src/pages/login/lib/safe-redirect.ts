export type LoginSearch = {
  /** Where to go after signing in; only same-app paths are honoured. */
  redirect?: string
}

export function safeRedirect(target: string | undefined) {
  return target?.startsWith('/') && !target.startsWith('//') ? target : '/'
}
