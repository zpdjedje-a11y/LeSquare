import { useState, useRef, useEffect } from "react"
import { VILLES_CI } from "../lib/villes"

interface CitySearchProps {
  value: string
  onChange: (ville: string) => void
  placeholder?: string
}

export default function CitySearch({ value, onChange, placeholder = "Rechercher une ville..." }: CitySearchProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleInput = (val: string) => {
    setQuery(val)
    if (val.length >= 2) {
      const filtered = VILLES_CI.filter(v =>
        v.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6)
      setSuggestions(filtered)
      setOpen(true)
    } else {
      setSuggestions([])
      setOpen(false)
    }
  }

  const select = (ville: string) => {
    setQuery(ville)
    onChange(ville)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={e => handleInput(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-noir border border-ambre/20 rounded-xl px-4 py-3 text-creme placeholder-creme/30 focus:outline-none focus:border-ambre text-sm"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-ambre/20 overflow-hidden z-50"
          style={{ backgroundColor: "#2A2A2A" }}>
          {suggestions.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => select(v)}
              className="w-full text-left px-4 py-2.5 text-creme text-sm hover:bg-ambre/10 transition-colors border-b border-ambre/10 last:border-0"
            >
              📍 {v}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}