import { useMatches } from '@tanstack/react-router'

/** Whether the current page asked for the whole window (`staticData.chrome: 'focus'`). */
export function useFocusChrome() {
  return useMatches({ select: (matches) => matches.some((match) => match.staticData?.chrome === 'focus') })
}
