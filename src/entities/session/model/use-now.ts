import { useEffect, useState } from 'react'

/** Re-renders every `interval` milliseconds while `active`. */
export function useNow(interval = 1000, active = true) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setNow(Date.now()), interval)
    return () => window.clearInterval(id)
  }, [interval, active])

  return now
}
