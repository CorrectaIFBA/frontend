import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

/** Types freely; reports the term once typing pauses, so each keystroke is not a request. */
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [draft, setDraft] = useState(value)

  // The URL is the source of truth: back/forward must refill the field.
  useEffect(() => setDraft(value), [value])

  useEffect(() => {
    if (draft === value) return
    const timer = setTimeout(() => onChange(draft), 300)
    return () => clearTimeout(timer)
  }, [draft, value, onChange])

  return (
    <label className="flex h-8 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-card px-2.5 text-muted-foreground transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/15">
      <Search className="size-3.5 shrink-0" />
      <input
        className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={draft}
      />
      {draft ? (
        <button
          aria-label="Limpar busca"
          className="cursor-pointer rounded-sm hover:text-foreground"
          onClick={() => {
            setDraft('')
            onChange('')
          }}
          type="button"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </label>
  )
}
