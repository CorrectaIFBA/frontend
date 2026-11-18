import { useEffect, useState } from 'react'

/** Waits for typing to pause before the term is searched. */
export function useDebounced(value: string, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
