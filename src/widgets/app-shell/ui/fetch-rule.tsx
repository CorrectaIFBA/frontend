import { useIsFetching } from '@tanstack/react-query'

export function FetchRule() {
  const fetching = useIsFetching()
  return <div aria-hidden className="fetch-rule" data-active={fetching > 0} />
}
